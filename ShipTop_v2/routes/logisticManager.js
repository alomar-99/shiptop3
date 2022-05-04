const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const equality = require('./tools/utility').equality;
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
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"' AND employeeID !=" +req.body.warehouseManagerID;
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.warehouseManagerID;
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if(result[0]!=undefined)
                        res.send({
                            "status": "DUPLICATE EMAIL", 
                            "err": true
                        });
                    else{
                        employeeSQL += "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.warehouseManagerID + ";\n";
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
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"' AND employeeID !=" +req.body.dispatcherID;
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.dispatcherID;
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if(result[0]!=undefined)
                        res.send({
                            "status": "DUPLICATE EMAIL", 
                            "err": true
                        });
                    else{
                        employeeSQL += "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.dispatcherID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.dispatcherID + ";\n";
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

//view list of shipments that are related to current logistic manager
router.post("/viewshipments",urlEncodedParser, (req, res) =>{
    let shipmentSQL = "START TRANSACTION; \n"; 
    shipmentSQL += "SELECT "
    shipmentSQL += "COMMIT; ";
    DB.query(shipmentSQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

// assignShipmentToDispatcher
router.post("/assignShipmentsToDispatcher",urlEncodedParser, (req, res) =>{
    let employee = ""
    if (req.body.next == "WM") employee = "currentEmployee";
    else employee = "assignedEmployee";
    let shipmentSQL = "START TRANSACTION; \n";
    shipmentSQL += "UPDATE shipmentdelivery\n SET "+employee+" = " + req.body.dispatcherID + " WHERE shipmentID IN(";
    for(let i =0;i<req.body.shipmentID.length;i++){
        shipmentSQL += req.body.shipmentID[i];
        if(i<req.body.shipmentID.length-1)
        shipmentSQL += ", ";
    }
    shipmentSQL += "); \n UPDATE shipmentupdate\n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shipmentID IN(";
    for(let i =0;i<req.body.shipmentID.length;i++){
        shipmentSQL += req.body.shipmentID[i];
        if(i<req.body.shipmentID.length-1)
        shipmentSQL += ", ";
    }
    shipmentSQL += "); \n"; 
    for(let i =0;i<req.body.shipmentID.length;i++){
        shipmentSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, action, actor)\n VALUES("+req.body.shipmentID[i]+", (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), '"+time.getDateTime()+"' ,'UPDATE', " + req.body.employeeID + "); \n";
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

//viewWarehouses
router.get("/viewWarehouses", (req, res) =>{
    let warehousesSQL = "SELECT wa.*, wm.memberID\n FROM warehouse wa \n INNER JOIN warehousemember wm\n ON wa.warehouseID = wm.warehouseID\n";
    warehousesSQL += "INNER JOIN employee em\n ON em.employeeID = wm.memberID AND em.role = 'WM'\n";
    warehousesSQL += "INNER JOIN office off\n ON off.location = wa.location AND off.employeeID = "+req.body.employeeID;
    DB.query(warehousesSQL, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        });
    }); 
});


//view all shipments for any logistic manager
router.get("/viewShipments", (req, res) =>{
    let shipmentsSQL = "SELECT ship.*,ord.orderID, shipDet.description, shipDet.height, shipDet.length, shipDet.weight, shipDet.width,\n shipDel.currentCity, shipDel.deliveryDate, shipDel.deliveryStatus, shipDel.currentEmployee, shipDel.assignedEmployee,\n shipUp.updatedBy, shipUp.lastUpdate FROM shipments\n";
    shipmentsSQL += "INNER JOIN shipmentdetails shipDet\n INNER JOIN shipmentdelivery shipDel\n INNER JOIN shipmentupdate shipUp\n INNER JOIN ordershipment ord\n ";
    shipmentsSQL += "ON ship.shipmentID = shipDet.shipmentID\n AND ship.shipmentID = shipDel.shipmentID\n AND ship.shipmentID = shipUp.shipmentID\n AND ship.shipmentID = ord.shipmentID\n ";

    for (const i in req.body.filteredBy){
        if((!(Object.keys(req.body.filteredBy[i]).length===0 && Object.getPrototypeOf(req.body.filteredBy[i]) === Object.prototype) && req.body.filteredBy[i]=="")  || typeof req.body.filteredBy[i] === "string")
            shipmentsSQL += " AND ship."+i+" = "+req.body.filteredBy[i] + "\n ";
        for(const j in req.body.filteredBy[i]){
            console.log(j, i);
        }
        // shipmentsSQL+= equality(req.body.filteredBy,i)
    }
    if (req.body.sortedBy.length>0)
    shipmentsSQL += "ORDER BY "
    for (let j=0;j<req.body.sortedBy.length;j++){
        shipmentsSQL += req.body.sortedBy[j].type + " " + req.body.sortedBy[j].order 
        if(j<req.body.sortedBy.length-1)
        shipmentsSQL += ", "
    }


    res.send(shipmentsSQL);
    // DB.query(shipmentsSQL, (err,result)=>{
    //     if (err) throw err;        
    //     res.send(result);
    // }); 
});



module.exports = router;