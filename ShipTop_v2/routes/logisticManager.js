const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add warehouse manager
router.post("/addWarehouseManager",urlEncodedParser, (req, res) => {
    const checkEmailSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    DB.query(checkEmailSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")     
            res.send({
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"'";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    let employeeSQL = "START TRANSACTION; \n";
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WM', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
                    employeeSQL += "COMMIT; "
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

//modify warehouse manager
router.post("/modifyWarehouseManager",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.warehouseManagerID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"'";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if (result[0]!=undefined){
                        if(result[0].employeeID!=req.body.warehouseManagerID)
                            res.send({
                                "status": "DUPLICATE EMAIL", 
                                "err": true
                            });
                        else{
                            employeeSQL += "START TRANSACTION; \n" 
                            employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                            employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                            employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n"
                            employeeSQL+= "COMMIT; "
                            DB.query(employeeSQL, (err)=>{
                                if (err) throw err; 
                                res.send({
                                    "status": "SUCCESS", 
                                    "err": false
                                });
                            });
                        }
                    }
                    else{
                        employeeSQL += "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET email= '"+ req.body.email +"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n"
                        employeeSQL+= "COMMIT; "
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

//delete warehouse manager
router.post("/deleteWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.warehouseManagerID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.warehouseManagerID ;
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

//view list of warehouseManagers that are related to current logistic manager
router.post("/viewWarehouseManagers",urlEncodedParser, (req, res) =>{
    let SQL = "SELECT WM.*,\n WMof.location,WMof.roomNumber,WMof.telephone,\n WMup.updatedBy,WMup.lastUpdate\n FROM employee WM\n";
    SQL += "INNER JOIN employeeupdate WMup\n ON WM.employeeID = WMup.employeeID AND WM.role='WM'";
    SQL += "INNER JOIN office WMof\n ON WM.employeeID  = WMof.employeeID AND WM.role='WM'";
    SQL += "JOIN office LMof\n ON LMof.employeeID = "+req.body.warehouseManagerID+" AND LMof.location = WMof.location";
    DB.query(SQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

//add Dispatcher
router.post("/addDispatcher",urlEncodedParser, (req, res) => {
    const checkEmailSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    DB.query(checkEmailSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")     
            res.send({
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"'";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    let employeeSQL = "START TRANSACTION; \n";
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'DI', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
                    employeeSQL += "COMMIT; "
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

//modify dispatcher
router.post("/modifyDispatcher",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.dispatcherID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"'";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if (result[0]!=undefined){
                        if(result[0].employeeID!=req.body.dispatcher)
                            res.send({
                                "status": "DUPLICATE EMAIL", 
                                "err": true
                            });
                        else{
                            employeeSQL += "START TRANSACTION; \n" 
                            employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                            employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                            employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.dispatcher + ";\n"
                            employeeSQL+= "COMMIT; "
                            DB.query(employeeSQL, (err)=>{
                                if (err) throw err; 
                                res.send({
                                    "status": "SUCCESS", 
                                    "err": false
                                });
                            });
                        }
                    }
                    else{
                        employeeSQL += "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET email= '"+ req.body.email +"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n"
                        employeeSQL+= "COMMIT; "
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

//delete dispatcher
router.post("/deleteDispatcher",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.dispatcherID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.dispatcherID ;
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

//view list of dispatchers that are related to current logistic manager
router.post("/viewDispatchers",urlEncodedParser, (req, res) =>{
    let SQL = "SELECT DI.*,\n DIof.location,DIof.roomNumber,DIof.telephone,\n DIup.updatedBy,DIup.lastUpdate\n FROM employee DI\n";
    SQL += "INNER JOIN employeeupdate DIup\n ON DI.employeeID = DIup.employeeID AND DI.role='DI'";
    SQL += "INNER JOIN office DIof\n ON DI.employeeID  = DIof.employeeID AND DI.role='DI'";
    SQL += "JOIN office LMof\n ON LMof.employeeID = "+req.body.dispatcherID+" AND LMof.location = DIof.location";
    DB.query(SQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

// //view list of shipments that are related to current logistic manager
// router.post("/viewshipments",urlEncodedParser, (req, res) =>{
//     let SQL = "";
//     DB.query(SQL, (err,result)=>{
//         if (err) throw err;
//         res.send(result);
//     });
// });

//assignShipmentToWarehouse
// router.post("/assignShipmentsToDispatcher",urlEncodedParser, (req, res) =>{
    
//     let SQL = "UPDATE shipment SET currentUserID = 'DI" + req.body.dispatcherID + "', updatedBy = 'LM"+req.body.employeeID+"', lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID IN (";
//     for(let i =0;i<req.body.shipmentID.length;i++){
//         SQL += req.body.shipmentID[i];
//         if(i<req.body.shipmentID.length-1)
//         SQL += ", ";
//     }
//     SQL += ")";
//     DB.query(SQL, (err)=>{
//         if (err) throw err;
//         res.send({
//             "status": "SUCCESS", 
//             "err": false
//         });
//     }); 
// });

//viewWarehouses


// //view all shipments for any logistic manager
// app.post("/api/logisticManager/viewShipments",urlEncodedParser, (req, res) =>{
//     let SQL = "SELECT * FROM shipments WHERE currentUserID REGEXP '^"+req.body.senderType+"' ";
//     for (const i in req.body.filteredBy){
//         SQL += "AND " + i; 
//         if(String(req.body.filteredBy[i]).includes("<x<"))
//         SQL += " BETWEEN "+ req.body.filteredBy[i].substring(0,req.body.filteredBy[i].indexOf("<")) + " AND " + req.body.filteredBy[i].substring(req.body.filteredBy[i].lastIndexOf("<")+1) + " ";
//         else if (String(req.body.filteredBy[i]).includes("<")||String(req.body.filteredBy[i]).includes(">")||String(req.body.filteredBy[i]).includes("!="))
//         SQL += req.body.filteredBy[i] + " ";
//         else if(typeof req.body.filteredBy[i]=="string")
//         SQL += " = '"+ req.body.filteredBy[i] + "' ";
//         else 
//         SQL += " = "+ req.body.filteredBy[i] + " ";
//     }
//     if (req.body.sortedBy.length>0)
//         SQL += "ORDER BY "
//     for (let j=0;j<req.body.sortedBy.length;j++){
//         SQL += req.body.sortedBy[j].type + " " + req.body.sortedBy[j].order 
//         if(j<req.body.sortedBy.length-1)
//         SQL += ", "
//     }
//     connection.query(SQL, (err,result)=>{
//         if (err) throw err;        
//         res.send(result);
//     }); 
// });



module.exports = router;