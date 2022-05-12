const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add driver
router.post("/addDriver",urlEncodedParser, (req, res) => {
    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
    DB.query(checkEmailSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")     
            res.send({
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC)";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    let employeeSQL = "START TRANSACTION; \n";
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'DR', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') , (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
                    employeeSQL += "INSERT INTO vehicledriver\n (driverID)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"')); \n";
                    employeeSQL += "COMMIT; ";
                    DB.query(employeeSQL, (err)=>{
                        if (err) throw err;
                        res.send({
                            "status": "SUCCESS", 
                            "err": false
                        });
                    });
                }
            });
        }
    });
});

//modify driver 
router.post("/modifyDriver",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.driverID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({ 
                "status": "ACC DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC) AND employeeID !=" +req.body.driverID;
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                console.log(result);
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{ 
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.driverID;
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if(result[0]!=undefined)
                        res.send({
                            "status": "DUPLICATE EMAIL", 
                            "err": true
                        });
                    else{
                        employeeSQL+= "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.driverID  + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.driverID  + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.driverID + ";\n";  
                        employeeSQL+= "COMMIT; ";
                        DB.query(employeeSQL, (err)=>{
                            if (err) throw err; 
                            res.send({
                                "status": "SUCCESS", 
                                "err": false
                            });
                        });
                    }
                });
                }
            });
        }
    });
});

//delete driver
router.post("/deleteDriver",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.driverID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.driverID ;
            DB.query(employeeSQL, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                }); 
            });
        }
    });
});

//view drivers 
router.get("/viewDrivers", (req, res) =>{
    let driverSQL = "SELECT DR.*, DRof.location, DRof.roomNumber, DRof.telephone, DRup.updatedBy, DRup.lastUpdate\n, ve.vehicleID\n";
    driverSQL += "FROM employee DR\n INNER JOIN employeeupdate DRup\n INNER JOIN office DIof\n INNER JOIN office DRof\n INNER JOIN vehicledriver ve\n";
    driverSQL += "ON DR.employeeID = DRup.employeeID\n AND DR.employeeID = DRof.employeeID\n AND DR.role='DR'\n AND ve.driverID = DR.employeeID\n AND DIof.employeeID = "+req.body.employeeID+"\n AND DIof.location = DRof.location\n";
    DB.query(driverSQL, (err,result)=>{
        if (err) throw err;
        res.send(driverSQL);
    });
});

//add vehicle 
router.post("/addVehicle",urlEncodedParser, (req, res) => {
    let vehicleSQL = "START TRANSACTION; \n"; 
    vehicleSQL += "INSERT INTO vehicle\n (currentLocation, capacity)\n VALUES ((SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), '"+req.body.capacity+"'); \n";
    vehicleSQL += "INSERT INTO vehicleregistration\n (vehicleID, plateNumber, manufacturerCompany, model, yearOfManufactoring, color, weightInTons)\n VALUES((SELECT MAX(vehicleID) FROM vehicle), '"+req.body.registration.plateNumber+"', '" 
    vehicleSQL += req.body.registration.manufacturerCompany+"', '" + req.body.registration.model +"', '" + req.body.registration.yearOfManufactoring+ "', '" + req.body.registration.color + "', " + req.body.registration.weightInTons +"); \n"
    vehicleSQL += "INSERT INTO vehicleupdate\n (vehicleID, dispatcherID, lastUpdate)\n VALUES ((SELECT MAX(vehicleID) FROM vehicle), "+req.body.employeeID+ ", '" + time.getDateTime() + "'); \n";
    vehicleSQL+= "COMMIT; ";
    DB.query(vehicleSQL, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        }); 
    });
});

//modify vehicle
router.post("/modifyVehicle",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM vehicle WHERE vehicleID = " +req.body.vehicleID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({ 
                "status": "VEHICLE DOESN't EXIST", 
                "err": true
            }); 
        else{
            let vehicleSQL= "START TRANSACTION; \n"; 
            vehicleSQL+= "UPDATE vehicle \n SET currentLocation = '" + req.body.location + "', capacity = " + req.body.capacity + " WHERE vehicleID = " + req.body.vehicleID + "; \n";
            vehicleSQL+= "UPDATE vehicleupdate \n SET dispatcherID = " + req.body.registration.employeeID + ", lastUpdate = '" + time.getDateTime() + "' WHERE vehicleID = " + req.body.vehicleID + "; \n";
            vehicleSQL+= "COMMIT; ";
            DB.query(vehicleSQL, (err)=>{
                if (err) throw err; 
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
            });
        }
    });
});

//delete vehicle
router.post("/deleteVehicle",urlEncodedParser, (req, res) => {
    const checkVehicleSQL = "SELECT vehicleID FROM vehicle WHERE vehicleID =" + req.body.vehicleID;
    DB.query(checkVehicleSQL, (err,result) => {
        if (err) throw err;
        if (result=="")
        res.send({
            "status": "VEHICLE DOESN'T EXIST", 
            "err": true
        });
        else{
            const vehicleSQL = "DELETE FROM vehicle WHERE vehicleID = " + req.body.vehicleID;
            DB.query(vehicleSQL, (err)=>{
            if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
            });
        }
    });
});

//view vehicles
router.get("/viewVehicles", (req, res) => {
    let vehicleSQL = "SELECT reg.*, ve.currentLocation, ve.capacity, DR.driverID, veup.lastupdate\n FROM vehicleregistration reg\n";
    vehicleSQL += "INNER JOIN vehicle ve\n INNER JOIN vehicleupdate veup\n ON ve.vehicleID = veup.vehicleID\n AND veup.dispatcherID = "+req.query.employeeID+"\n";
    vehicleSQL += "AND ve.vehicleID = reg.vehicleID\n LEFT JOIN vehicledriver DR\n ON ve.vehicleID = DR.vehicleID\n ";
    DB.query(vehicleSQL, (err,result)=>{
        if (err) throw err; 
        res.send(result);
    });
});

//assign driver to vehicle  
router.post("/assignVehicleToDriver",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.driverID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let assignmentSQL="";
        if (result=="")    
            res.send({ 
                "status": "DRIVER DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkVehicleSQL = "SELECT vehicleID FROM vehicle WHERE vehicleID ="+ req.body.vehicleID;
            DB.query(checkVehicleSQL, (err,result)=>{
                if (err) throw err;
                if (result=="")    
                    res.send({ 
                        "status": "VEHICLE DOESN't EXIST", 
                        "err": true
                    }); 
                else{ 
                    assignmentSQL += "START TRANSACTION; \n" 
                    assignmentSQL += "UPDATE vehicledriver SET vehicleID = " + req.body.vehicleID + " WHERE driverID = " + req.body.driverID+"; \n";
                    assignmentSQL += "UPDATE vehicleupdate SET dispatcherID = "+ req.body.employeeID +", lastUpdate = '"+ time.getDateTime() +"'\n WHERE vehicleID = " + req.body.vehicleID + "; \n"; 
                    assignmentSQL += "UPDATE employeeupdate SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.driverID + "; \n";
                    assignmentSQL += "UPDATE vehicledriver SET vehicleID = NULL WHERE driverID !="+ req.body.driverID +" AND vehicleID = "+req.body.vehicleID+"; \n";
                    assignmentSQL += "COMMIT; ";
                    console.log(assignmentSQL);
                    DB.query(assignmentSQL, (err)=>{
                        if (err) throw err; 
                        res.send({
                            "status": "SUCCESS", 
                            "err": false
                        });
                    });
                }
            });
        }
    });
});

//assign shipments to driver
router.post("/assignShipmentsToDriver",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.driverID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({ 
                "status": "DRIVER DOESN't EXIST", 
                "err": true
            }); 
        else{
            let checkAssignedSQL = "SELECT shipmentID,assignedEmployee FROM shipmentdelivery WHERE currentEmployee = " +req.body.employeeID+" AND shipmentID IN(";
            for(let i =0;i<req.body.shipmentID.length;i++){
                checkAssignedSQL += req.body.shipmentID[i];
                if(i<req.body.shipmentID.length-1)
                checkAssignedSQL += ", ";
            } 
            checkAssignedSQL+= ")";
            DB.query(checkAssignedSQL, (err, result)=>{
                if (err) throw err;
                let shipmentSQL = "START TRANSACTION; \n";
                for (const i in result){
                    shipmentSQL += "UPDATE shipmentdelivery\n SET currentEmployee = " + req.body.driverID;
                    if(result[i].assignedEmployee==req.body.employeeID) shipmentSQL+= ", assignedEmployee = " + req.body.driverID + " ";
                    shipmentSQL +="\n WHERE shipmentID = " + result[i].shipmentID + "; \n";
                    shipmentSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, userAction, actor)\n VALUES("+result[i].shipmentID+", (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), '"+time.getDateTime()+"' ,'UPDATE', " + req.body.employeeID + "); \n";
                }
                if(result.length>0){
                    shipmentSQL += "UPDATE shipmentupdate\n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shipmentID IN(";
                    for(let i =0;i<result.length;i++){
                        shipmentSQL += result[i].shipmentID;
                        if(i<result.length-1)
                            shipmentSQL += ", "; 
                        }
                    shipmentSQL += "); \n"; 
                }
                shipmentSQL += "COMMIT; ";
                DB.query(shipmentSQL, (err)=>{
                    if (err) throw err;
                    res.send({
                        "status": "SUCCESS", 
                        "err": false
                    });
                }); 
            });
        }
    });
});



module.exports = router;