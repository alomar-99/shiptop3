const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility').getDateTime();
const urlEncodedParser = require('./tools/config').middleware;

//add warehouse manager
router.post("/addWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")     
            res.send({
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const employeeSQL = "INSERT INTO employee(firstName, lastName, role, email, phoneNumber, password)"+ "VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"') ";
            const officeSQL = "INSERT INTO office(employeeID, location, telephone) VALUES(" + "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "')";
            const updateSQL = "INSERT INTO employeeupdate (employeeID, updatedBy, lastUpdate) VALUES( "+ "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time + "')";
            DB.query(employeeSQL, (err)=>{
            if (err) throw err;
            });
            DB.query(officeSQL, (err)=>{
                if (err) throw err;
            });
            DB.query(updateSQL, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS",
                    "err": false
                });
            });
        }
    });
});

//modify warehouse manager
router.post("/modifyWarehouseManager",urlEncodedParser, (req, res) => {
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
                const employeeSQL = "UPDATE employee SET email = '"+req.body.email+"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+req.body.password +"' WHERE employeeID = "+req.body.warehouseManagerID;
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

module.exports = router;