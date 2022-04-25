//imports
const express = require('express');
const bodyParser = require('body-parser');
const conn = require('./connection');
const time = require('./utility');
// const router = require("express").Router();

// middleware handler
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

//initializing express
const app = express();
const port = process.env.PORT || 3000;

//accepting json files
app.use(express.json());

//create connection
const connection = conn.startConnection();
connection.connect(err => {
    if (err) {
        console.log(err);
    } 
    console.log("database connected successfully");
});

//EMPLOYEE //////////////////////////////////////////////////////
// sign in for any employee
app.post("/api/employee/signIn",urlEncodedParser, (req, res) => {
    let sql = "SELECT * FROM employees WHERE email = '" + req.body.email + "' AND password = '"+ req.body.password +"'";
    connection.query(sql, (err, result)=>{
        if (err) throw err;
            if (result=="")response ={
                "status": "ACC DOESN't EXIST", 
                "err": true
            };
            else response = result[0];
            res.send(response);
    });
});













































//LOGISTIC MANAGER //////////////////////////////////////////////////////
//adding warehouseManager for any logistic manager
app.post("/api/logisticManager/addWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
    
        else{
            const employeeSQL = "INSERT INTO employee(firstName, lastName, role, email, phoneNumber, password)"+ "VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"') ";
            const officeSQL = "INSERT INTO office (employeeID, location, telephone) VALUES(" + "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "')";
            const updateSQL = "INSERT INTO employeeupdate (employeeID, updatedBy, lastUpdate) VALUES( "+ "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "')";
            connection.query(employeeSQL, (err)=>{
            if (err) throw err;
            });
            connection.query(officeSQL, (err)=>{
                if (err) throw err;
            });
            connection.query(updateSQL, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
            });
        }
    });
});

//updating warehouseManager for any logistic manager
app.post("/api/logisticManager/modifyWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.warehouseManagerID;
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const errSQL2 = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
            connection.query(errSQL2, (err, result)=>{
            if (err) throw err;  
            if (result[0].employeeID!=req.body.warehouseManagerID)  
                res.send({
                    "status": "DUPLICATE EMAIL", 
                    "err": true
                });
            else{
                const employeeSQL = "UPDATE employee SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+req.body.password + "', updatedBy = 'LM"+req.body.employeeID+"', lastUpdate = '"+time.getDateTime()+"' WHERE employeeID = "+req.body.warehouseManagerID + " AND role = 'WM'";
                connection.query(sql, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
                });
                
                connection.query(employeeSQL, (err)=>{
                    if (err) throw err;
                });
            }
        });
        }
    });
});

//deleting warehouseManager for any logistic manager
app.post("/api/logisticManager/deleteWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE employeeID ='" +req.body.warehouseManagerID +"' AND role = 'WM'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "DELETE FROM warehousemanagers WHERE warehouseManagerID = "+req.body.warehouseManagerID;
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "DELETE FROM employees WHERE employeeID = "+req.body.warehouseManagerID + " AND role = 'WM'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//adding dispatcher for any logistic manager
app.post("/api/logisticManager/addDispatcher",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO dispatchers(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'LM" + req.body.employeeID +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, dispatcherID, 'DI', firstName, lastName, phoneNumber, password, updatedBy,lastUpdate FROM dispatchers Where dispatchers.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//updating dispatcher for any logistic manager
app.post("/api/logisticManager/modifyDispatcher",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE employeeID ='" +req.body.dispatcherID +"' AND role = 'DI'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const errSQL2 = "SELECT employeeID FROM employees WHERE email ='" +req.body.email +"'";
            connection.query(errSQL2, (err, result)=>{
            if (err) throw err;
            if (result[0].employeeID!=req.body.dispatcherID)  
                res.send({
                    "status": "DUPLICATE EMAIL", 
                    "err": true
                });
            else{
                today = time.getDateTime();
                const sql = "UPDATE dispatchers SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+req.body.password + "', updatedBy = 'LM"+req.body.employeeID+"', lastUpdate = '"+today+"' WHERE dispatcherID = "+req.body.dispatcherID;
                connection.query(sql, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
                });
                const employeeSQL = "UPDATE employees SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+req.body.password + "', updatedBy = 'LM"+req.body.employeeID+"', lastUpdate = '"+today+"' WHERE employeeID = "+req.body.dispatcherID + " AND role = 'DI'";
                connection.query(employeeSQL, (err)=>{
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });
            }
        });
        }
    });
});

//deleting dispatcher for any logistic manager
app.post("/api/logisticManager/deleteDispatcher",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE employeeID ='" +req.body.dispatcherID +"' AND role = 'DI'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "DELETE FROM dispatchers WHERE dispatcherID = "+req.body.dispatcherID;
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "DELETE FROM employees WHERE employeeID = "+req.body.dispatcherID + " AND role = 'DI'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//viewing list of dispatchers for any logistic manager
app.post("/api/logisticManager/viewDispatchers",urlEncodedParser, (req, res) =>{
    const SQL = "SELECT * FROM dispatchers WHERE updatedBy = 'LM" + req.body.employeeID+"'";
    connection.query(SQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//viewing list of warehouseManagers for any logistic manager
app.post("/api/logisticManager/viewWarehouseManagers",urlEncodedParser, (req, res) =>{
    const SQL = "SELECT * FROM warehouseManagers WHERE updatedBy = 'LM" + req.body.employeeID+"'";
    connection.query(SQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//view all shipments for any logistic manager
app.post("/api/logisticManager/viewShipments",urlEncodedParser, (req, res) =>{
    let SQL = "SELECT * FROM shipments WHERE currentUserID REGEXP '^"+req.body.senderType+"' ";
    for (const i in req.body.filteredBy){
        SQL += "AND " + i; 
        if(String(req.body.filteredBy[i]).includes("<x<"))
        SQL += " BETWEEN "+ req.body.filteredBy[i].substring(0,req.body.filteredBy[i].indexOf("<")) + " AND " + req.body.filteredBy[i].substring(req.body.filteredBy[i].lastIndexOf("<")+1) + " ";
        else if (String(req.body.filteredBy[i]).includes("<")||String(req.body.filteredBy[i]).includes(">")||String(req.body.filteredBy[i]).includes("!="))
        SQL += req.body.filteredBy[i] + " ";
        else if(typeof req.body.filteredBy[i]=="string")
        SQL += " = '"+ req.body.filteredBy[i] + "' ";
        else 
        SQL += " = "+ req.body.filteredBy[i] + " ";
    }
    if (req.body.sortedBy.length>0)
        SQL += "ORDER BY "
    for (let j=0;j<req.body.sortedBy.length;j++){
        SQL += req.body.sortedBy[j].type + " " + req.body.sortedBy[j].order 
        if(j<req.body.sortedBy.length-1)
        SQL += ", "
    }
    connection.query(SQL, (err,result)=>{
        if (err) throw err;        
        res.send(result);
    }); 
});

//assigning shipments for any dispatcher for any logistic manager
app.post("/api/logisticManager/assignShipmentsToDispatcher",urlEncodedParser, (req, res) =>{
    
    let SQL = "UPDATE shipments SET currentUserID = 'DI" + req.body.dispatcherID + "', updatedBy = 'LM"+req.body.employeeID+"', lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID IN (";
    for(let i =0;i<req.body.shipmentID.length;i++){
        SQL += req.body.shipmentID[i];
        if(i<req.body.shipmentID.length-1)
        SQL += ", ";
    }
    SQL += ")";
    connection.query(SQL, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        });
    }); 
});

























//Owner /////////////////////////////////
//adding administrator 
app.post("/api/owner/addAdministrator",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO administrators(firstName, lastName, email, phoneNumber, password, office, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', '" + req.body.office +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, administratorID, 'AD', firstName, lastName, phoneNumber, password, 'OW', lastUpdate FROM administrators Where administrators.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
        }
    });
});

//updating admnistrator
app.post("/api/owner/modifyAdministrator",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE employeeID ='" +req.body.adminID +"' AND role = 'AD'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const errSQL2 = "SELECT employeeID FROM employees WHERE email ='" +req.body.email +"'";
            connection.query(errSQL2, (err, result)=>{
            if (err) {
                console.log(err);
                throw err;
            }   
            if (result[0].employeeID!=req.body.adminID)  
                res.send({
                    
                    "status": "DUPLICATE EMAIL", 
                    "err": true
                });
            else{
                today = time.getDateTime();
                const sql = "UPDATE administrators SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password + "', office = '"+ req.body.office + "', lastUpdate = '"+today+"' WHERE administratorID = "+req.body.adminID;
                connection.query(sql, (err)=>{
                if (err) throw err;                
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
                });
                const employeeSQL = "UPDATE employees SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+req.body.password + "', updatedBy = 'OW', lastUpdate = '"+today+"' WHERE employeeID = "+req.body.adminID + " AND role = 'AD'";
                connection.query(employeeSQL, (err)=>{
                    if (err) throw err;
                });
            }
        });
        }
    });
});

//deleting administrator 
app.post("/api/owner/deleteAdministrator",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE employeeID ='" +req.body.adminID +"' AND role = 'AD'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "DELETE FROM administrators WHERE administratorID = "+req.body.adminID;
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "DELETE FROM employees WHERE employeeID = "+req.body.adminID + " AND role = 'AD'";
            connection.query(employeeSQL, (err)=>{
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
        }
    });
});

//viewing list of administrators
app.post("/api/owner/viewAdministrators",urlEncodedParser, (req, res) =>{
    const SQL = "SELECT * FROM administrators";
    connection.query(SQL, (err,result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        res.send(result);
    });
});















































//Administrator //////////////////////////////////////////////
//adding logistic Manager for any administrator
app.post("/api/administrator/addLogisticManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO logisticmanagers(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'AD" + req.body.employeeID +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, logisticManagerID, 'LM', firstName, lastName, phoneNumber, password, updatedBy, lastUpdate FROM logisticmanagers Where logisticmanagers.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//adding freight broker for any administrator
app.post("/api/administrator/addFreightBroker",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO freightbrokers(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'AD" + req.body.employeeID +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, freightBrokerID, 'FB', firstName, lastName, phoneNumber, password, updatedBy, lastUpdate FROM freightbrokers Where freightbrokers.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//adding customer server for any administrator
app.post("/api/administrator/addCustomerServer",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO customerservers(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'AD" + req.body.employeeID +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, customerServerID, 'CS', firstName, lastName, phoneNumber, password, updatedBy, lastUpdate FROM customerservers Where customerservers.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//adding accountant for any administrator
app.post("/api/administrator/addAccountant",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err)throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO accountants(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'AD" + req.body.employeeID +"', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, accountantID, 'AC', firstName, lastName, phoneNumber, password, updatedBy, lastUpdate FROM accountants Where accountants.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});
































// warehouse manager ///////////////////////////////////
// adding worker for any warehouse manager 
app.post("/api/warehouseManager/addWorker",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT warehouseID FROM warehousemanagers WHERE warehouseManagerID ='" +req.body.employeeID+"'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        if (result[0].warehouseID==0)    
            res.send({
                "status": "WAREHOUSE DOESN'T EXIST", 
                "err": true
            });
        else{ 
            today = time.getDateTime();
            const sql = "INSERT INTO workers(firstName, lastName, email, phoneNumber, password, warehouseID, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', " + result[0].warehouseID+", 'WM" + req.body.employeeID +"', '"+ today+"')"
            console.log(sql);
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees SELECT email, workerID, 'WO', firstName, lastName, phoneNumber, password, updatedBy, lastUpdate FROM workers Where workers.email = '"+req.body.email+"'";
            connection.query(employeeSQL, (err)=>{
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
        }
    });
});

//add warehouse for any warehouse manager
app.post("/api/warehouseManager/addWarehouse",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT warehouseID FROM warehousemanagers WHERE warehouseManagerID ='" +req.body.employeeID+"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result[0].warehouseID!=0)    
            res.send({
                "status": "EXISTING WAREHOUSE", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO warehouses(city, telephone, warehouseManagerID, lastUpdate)"+ "values('" + req.body.city + "', " + req.body.telephone + ", '" + req.body.employeeID + "', '"+ today+"')";
            connection.query(sql, (err)=>{
            if (err) throw err;

            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const updateSQL = "UPDATE warehousemanagers SET warehouseID = (SELECT warehouseID FROM warehouses WHERE warehouseManagerID = "+req.body.employeeID +") WHERE warehouseManagerID = "+req.body.employeeID;
            connection.query(updateSQL, (err)=>{
                if (err) throw err;
            });
        }
    });
});

//assigning shipment to dispatcher for any warehouse manager
app.post("/api/warehouseManager/assignShipmentToDispatcher",urlEncodedParser, (req, res) => {
    const sql = "UPDATE shipments SET currentUserID = 'DI"+req.body.dispatcherID +"', updatedBy = 'WM"+req.body.employeeID+"', lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID ="+req.body.shipmentID;
    connection.query(sql, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        });
        });
});

//assigning shipments to workers for any warehouse manager
app.post("/api/warehouseManager/assignShipmentToWorker",urlEncodedParser, (req, res) => {
    const sql = "UPDATE shipments SET currentUserID = 'WO"+req.body.workerID +"', updatedBy = 'WM"+req.body.employeeID+"', lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID ="+req.body.shipmentID;
    connection.query(sql, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        });
        });  
});

//add warehouse for any warehouse manager
app.post("/api/warehouseManager/addShelf",urlEncodedParser, (req, res) => {
    const sql = "INSERT INTO shelfs(shelfNumber, row, section, lane, floor, isReserved, warehouseID, assignedShipmentID, updatedBy, lastUpdate) VALUES( "+req.body.shelfNumber +", " + req.body.row + ", '" + req.body.section + "', " + req.body.lane + ", '" + req.body.floor + "', false," 

});




































let example = {
    "shipmentID": "",

}

//DRIVER //////////////////////////////////////////////
app.post("/api/driver/viewassinedShipment",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM shipments WHERE currentPlace ='" +req.body.currentPlace +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        if (result=="")    
            res.send({
                "status": "no shipment", 
                "err": true
            });
        else{

    
            connection.query(errSQL, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(JSON.stringify(result));

            //{

            //   "status": "SUCCESS", 
            //    "err": false
            //}
            });
        }
    });
});

app.post("/api/driver/viewListShipments",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM shipments ";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        if (result=="")    
            res.send({
                "status": "no EXISTING shipments", 
                "err": true
            });
        else{

    
            connection.query(errSQL, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(JSON.stringify(result));

            //{

            //   "status": "SUCCESS", 
            //    "err": false
            //}
            });
        }
    });
});





let example4 = {
    "shipmentID": "1",
    "status": "deleverd",
}
app.post("/api/driver/updateShipmentStatus",urlEncodedParser, (req, res) => {
    let sql = "UPDATE shipments SET 'status' = "+req.body.status+" where'shipmentID' = "+req.body.shipmentId;
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(
            {
              "status": "SUCCESS", 
               "err": false
            }
            );
            });    
});



////////////////dispatcher////////////

app.post("/api/dispatcher/addShipment",urlEncodedParser, (req, res) => {
    today = time.getDateTime();
    const sql = "INSERT INTO `shipments`( `destinationNumber`, `weight`, `description`, `length`, `width`, `height`, `isBreakable`, `status`, `telephone`, `department`, `address`, `sender`, `departureCity`, `arrivalCity`, `arrivalDate`, `deliveryDate`, `warehouseID`, `updatedBy`, `lastUpdate`)"+
     "VALUES ("+req.body.destinationNumber +"," +req.body.weight +",'" +req.body.description +"'," +req.body.length +"," +req.body.width +"," +req.body.height +"," +req.body.isBreakable +"," +req.body.status +",'" +req.body.telephone +"','" +req.body.department +"','" +req.body.address +"','" +req.body.sender +"','" +req.body.departureCity +"','"+req.body.arrivalCity+"','"+req.body.arrivalDate +"','"+req.body.deliveryDate+"','"+ req.body.warehouseID+"','"+req.body.updatedBy+"','"+today+"')";
    
 
         
            
             connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            
        
    
});
app.post("/api/dispatcher/viewShipment",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM shipments WHERE currentPlace ='" +req.body.currentPlace +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        if (result=="")    
            res.send({
                "status": "no shipment", 
                "err": true
            });
        else{

    
            connection.query(errSQL, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(JSON.stringify(result));

            //{

            //   "status": "SUCCESS", 
            //    "err": false
            //}
            });
        }
    });
});
app.post("/api/dispatcher/addVehicle",urlEncodedParser, (req, res) => {
    today = time.getDateTime();
    const sql = "INSERT INTO `vehicles`( `vehicleName`, `manufacturerCompany`, `status`, `address`, `assignedDriver`, `dispatcherID`, `lastUpdate`) ";
    +"VALUES ('" +req.body.vehicleName +"','" +req.body.manufacturerCompany +"','" +req.body.status +"',\'" +req.body.address +"',\'" +req.body.assignedDriver +"',\'" +req.body.dispatcherID +"',\'"+today+"')";
   
             connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
        
});

app.post("/api/driver/updateVehicleStatus",urlEncodedParser, (req, res) => {
    today = time.getDateTime();
    let sql = "UPDATE vehicles SET 'status' = '"+req.body.status+"','lastUpdate' = "+today+" where'vehicleID' = "+req.body.vehicleId;
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(
            {
              "status": "SUCCESS", 
               "err": false
            }
            );
            });    
});
app.post("/api/driver/editVehicle",urlEncodedParser, (req, res) => {
    today = time.getDateTime();
    let sql = "UPDATE vehicles SET 'address' = '"+req.body.address+"','lastUpdate' = "+today+",'vehicleName' = '"+req.body.vehicleName+"','assignedDriver' = "+req.body.status+", where'vehicleID' = "+req.body.vehicleId;
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send(
            {
              "status": "SUCCESS", 
               "err": false
            }
            );
            });    
});










let example2 = {
    "employeeID": "75",
    "firstName": "Ahmed",
    "lastName": "Khalid",
    "email": "k84734@gmail.com",
    "phoneNumber": "021846544",
    "password": "hud72947",
    "warehouseID": "99851"
}


//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
