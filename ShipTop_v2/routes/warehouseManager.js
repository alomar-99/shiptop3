const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add warehouse 
router.post("/addWarehouse",urlEncodedParser, (req, res) => {
    const checkWarehouseSQL = "SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID;
    DB.query(checkWarehouseSQL, (err, result) => {
        if (err) throw err;
        if(result!="")
        res.send({
            "status": "EXISTING WAREHOUSE", 
            "err": false
        });
        else{
            let warehouseSQL = "START TRANSACTION; \n";
            warehouseSQL += "INSERT INTO warehouse\n (location)\n VALUES ('"+req.body.city+"'); \n"
            warehouseSQL += "INSERT INTO warehousemember\n (memberID, warehouseID)\n VALUES("+req.body.employeeID+", (SELECT MAX(warehouseID) FROM warehouse)); \n"
            warehouseSQL += "INSERT INTO warehouseupdate(warehouseID, managerID, lastUpdate)\n VALUES((SELECT MAX(warehouseID) FROM warehouse), "+req.body.employeeID+", '"+time.getDateTime()+"'); \n";
            warehouseSQL += "COMMIT; ";
            DB.query(warehouseSQL, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                }); 
            });
        }
    });
});

//modify warehouse 


//delete warehouse



//view unused warehouses
router.post("/viewUnusedWarehouses",urlEncodedParser, (req, res) => {
    const warehouseSQL = "SELECT wa.*\n FROM warehouse wa\n INNER JOIN warehousemember WAwm\n ON wa.warehouseID != WAwm.warehouseID\n INNER JOIN employee WM\n ON WM.role='WM' AND WM.employeeID = WAwm.memberID;";
    DB.query(warehouseSQL, (err,result)=>{
        if (err) throw err;
        res.send(result); 
    });
});

//assign to existing warehouse


//add warehouse worker
router.post("/addWorker",urlEncodedParser, (req, res) => {
    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
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
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO warehousemember\n (memberID, warehouseID)\n VALUES ((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"'),(SELECT DISTINCT wm.warehouseID FROM warehousemember wm INNER JOIN warehousemember wo ON wm.memberID= "+req.body.employeeID+")); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
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

// modify worker
router.post("/modifyWorker",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.workerID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({ 
                "status": "ACC DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"' AND employeeID !=" +req.body.workerID;
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                console.log(result);
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{ 
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.workerID;
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if(result[0]!=undefined)
                        res.send({
                            "status": "DUPLICATE EMAIL", 
                            "err": true
                        });
                    else{
                        employeeSQL+= "START TRANSACTION; \n" 
                        employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.workerID + ";\n";  
                        employeeSQL+= "UPDATE warehousemember \n SET warehouseID = " + req.body.warehouseID + "\n WHERE memberID = " + req.body.workerID + ";\n";
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

//delete worker
router.post("/deleteWorker",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.workerID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.workerID ;
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

//view workers
router.post("/viewWorkers",urlEncodedParser, (req, res) => {
    let workerSQL = "SELECT  "


//     SELECT WO.*, WOof.location,WOof.roomNumber,WOof.telephone,
//  WOup.updatedBy,WOup.lastUpdate
//  FROM employee WO
//  INNER JOIN employeeupdate WOup 
//  ON WO.employeeID = WOup.employeeID AND WO.role='WO'
//  INNER JOIN office WOof 
//  ON WO.employeeID  = WOof.employeeID AND WO.role='WO'
//  INNER JOIN office WMof 
//  ON WMof.employeeID = 11;
//
// SELECT count(WOsh.shelfID) AS emptyShelfs 
// FROM workerShelf WOsh 
// INNER JOIN shelfreservation shelfRes
// ON shelfRes.shelfID = WOsh.shelfID AND shelfRes.assignedShipment=null





// SELECT WO.*, WOof.location,WOof.roomNumber,WOof.telephone,
//  WOup.updatedBy,WOup.lastUpdate, count(WOsh.shelfID) AS emptyShelfs 
//  FROM employee WO
//  INNER JOIN employeeupdate WOup 
//  ON WO.employeeID = WOup.employeeID AND WO.role='WO'
//  INNER JOIN office WOof 
//  ON WO.employeeID  = WOof.employeeID AND WO.role='WO'
//  INNER JOIN office WMof 
//  ON WMof.employeeID = 11
// LEFT JOIN workerShelf WOsh 
// ON WOsh.workerID = WO.employeeID


});

//view shipments in a warehouse


router.post("/viewShipments",urlEncodedParser, (req, res) => {

    
// SELECT ship.*,ord.orderID, shipDet.description, shipDet.height, shipDet.length, shipDet.weight, shipDet.width, 
// shipDel.currentCity, shipDel.deliveryDate, shipDel.deliveryStatus, shipDel.currentEmployee, shipDel.assignedEmployee,
// shipUp.updatedBy, shipUp.lastUpdate
// From shipment ship
// INNER JOIN shipmentdetails shipDet
// ON ship.shipmentID = shipDet.shipmentID
// INNER JOIN shipmentdelivery shipDel
// ON ship.shipmentID = shipDel.shipmentID
// INNER JOIN shipmentupdate shipUp
// ON ship.shipmentID = shipUp.shipmentID
// INNER JOIN ordershipment ord
// ON ship.shipmentID = ord.shipmentID
// INNER JOIN shelfreservation shelfres
// ON ship.shipmentID = shelfres.assignedShipment
// INNER JOIN shelfaddress shelfAdd
// ON shelfres.shelfID = shelfAdd.shelfID
// INNER JOIN warehouse wa 
// ON wa.warehouseID = shelfAdd.warehouseID
// INNER JOIN warehousemember WAwm
// ON WAwm.warehouseID = wa.warehouseID
// INNER JOIN employee WM
// ON WM.employeeID = WAwm.memberID AND WM.employeeID = 13;

});


//assign shipment to dispatcher


//assign shelfs to worker


//assign shipment to worker 
router.post("/addWorker",urlEncodedParser, (req, res) => {



});



module.exports = router; 