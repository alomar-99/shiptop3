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
        if(result[0].warehouseID!=null)
        res.send({
            "status": "EXISTING WAREHOUSE", 
            "err": false
        }); 
        else{
            let warehouseSQL = "START TRANSACTION; \n";
            warehouseSQL += "INSERT INTO warehouse\n (location, address)\n VALUES ('"+req.body.city+"', '"+req.body.address+"'); \n";
            warehouseSQL += "UPDATE warehousemember\n SET warehouseID = (SELECT MAX(warehouseID) FROM warehouse)\n WHERE memberID = " +req.body.employeeID+ "; \n"
            warehouseSQL += "INSERT INTO warehouseupdate(warehouseID, managerID, lastUpdate)\n VALUES((SELECT MAX(warehouseID) FROM warehouse), "+req.body.employeeID+", '"+time.getDateTime()+"'); \n";
            warehouseSQL += "COMMIT; ";
            console.log(warehouseSQL);
            DB.query(warehouseSQL, (err)=>{
                if (err) throw err;
            });
            let floor,lane,section,row,number = 0;
            let total =0;
            const limit = 6000; //max = 7500
            let queryIncrement = 0;
            let maxShelfs = req.body.shelf.floors*req.body.shelf.lanes*req.body.shelf.sections*req.body.shelf.rows*req.body.shelf.number
            let shelfSQL="START TRANSACTION; \n";
            for(floor=1;floor<=req.body.shelf.floors; floor++){
                for(lane=1;lane<=req.body.shelf.lanes; lane++){
                    for(section=1;section<=req.body.shelf.sections; section++){
                        for(row=1;row<=req.body.shelf.rows; row++){
                            for(number=1;number<=req.body.shelf.number; number++){
                                if(queryIncrement==limit){
                                    queryIncrement=0; 
                                } 
                                shelfSQL += "INSERT INTO shelf(width,height)\n VALUES("+req.body.shelf.width+", "+req.body.shelf.height+"); \n";
                                shelfSQL += "INSERT INTO shelfaddress\n (shelfID, shelfNumber, row, section, lane, floor, warehouseID)\n VALUES((SELECT MAX(shelfID) FROM shelf), "+number+", "+row+", " +section+", "+lane+", "+floor+", (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
                                shelfSQL += "INSERT INTO shelfupdate\n (shelfID, updatedBy, lastUpdate)\n VALUES((SELECT MAX(shelfID) FROM shelf), "+req.body.employeeID +", '"+time.getDateTime()+"'); \n";
                                shelfSQL += "INSERT INTO workerShelf\n (shelfID)\n VALUES((SELECT MAX(shelfID) FROM shelf)); \n";
                                shelfSQL += "INSERT INTO shelfreservation\n (shelfID)\n VALUES((SELECT MAX(shelfID) FROM shelf)); \n";
                                if(queryIncrement==0||total==maxShelfs-1){
                                    shelfSQL += "COMMIT; ";
                                    console.log("floor ="+ floor +" lane =" + lane + " section = "+section + " row = "+row +" number = "+number+" total = "+total);
                                    DB.query(shelfSQL, (err)=>{
                                        if (err) throw err;
                                    }); 
                                    shelfSQL="START TRANSACTION; \n";
                                }
                                total++;
                                queryIncrement++;
                            }
                        }
                    }
                } 
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });          
        }
    });
});

//delete warehouse 
router.post("/deleteWarehouse",urlEncodedParser, (req, res) => {
    const checkWarehouseSQL = "SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID
    DB.query(checkWarehouseSQL, (err,result)=>{
        if (err) throw err;
        if(result=="")
        res.send({
            "status": "WAREHOUSE DOESN't EXIST'", 
            "err": true
        });
        else{ 
            let warehouseSQL ="START TRANSACTION; \n";
            warehouseSQL += "DELETE FROM shelf WHERE shelfID BETWEEN\n (SELECT MIN(shelfID) FROM shelfaddress WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+"))\n"
            warehouseSQL += "AND (SELECT MAX(shelfID) FROM shelfaddress WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
            warehouseSQL += "DELETE FROM warehouse WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+"); \n";
            warehouseSQL += "DELETE FROM employee WHERE employeeID = (SELECT memberID FROM warehousemember WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
            warehouseSQL+= "COMMIT; ";
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

//view unused warehouses
router.post("/viewUnusedWarehouses",urlEncodedParser, (req, res) => {
    const warehouseSQL = "SELECT wa.*\n FROM warehouse wa\n INNER JOIN warehousemember WAwm\n ON wa.warehouseID != WAwm.warehouseID\n INNER JOIN employee WM\n ON WM.role='WM' AND WM.employeeID = WAwm.memberID;";
    DB.query(warehouseSQL, (err,result)=>{
        if (err) throw err;
        res.send(result); 
    });
});

//assign to existing warehouse //TODO: later


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
                        employeeSQL+= "START TRANSACTION; \n"; 
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

    // SELECT WO.firstName,WO.lastName, WO.email,WO.phoneNumber, WO.password, WOof.location,WOof.roomNumber,WOof.telephone,
    // WOup.updatedBy,WOup.lastUpdate
    // , count(res.shelfID) AS emptyShelfs 
    // FROM employee WO
    // INNER JOIN employeeupdate WOup 
    // INNER JOIN office WOof 
    // INNER JOIN warehousemember WAwm
    // INNER JOIN warehousemember WAwo
    // INNER JOIN employee WM
    // INNER JOIN workerShelf WOsh
    // INNER JOIN shelfreservation res
    // ON WO.employeeID = WOup.employeeID 
    // AND WO.employeeID  = WOof.employeeID
    // AND WM.employeeID = 54
    // AND WAwm.memberID = WM.employeeID
    // AND WAwm.warehouseID = WAwo.warehouseID
    // AND WAwo.memberID = WO.employeeID
    // AND WO.role = 'WO'
    // AND WOsh.workerID = WO.employeeID
    // AND res.shelfID = WOsh.shelfID AND res.assignedShipment = null
    // GROUP BY WO.employeeID
    



});

//view shipments in a warehouse
router.post("/viewShipments",urlEncodedParser, (req, res) => {


});


//assign shipments to dispatcher
router.post("/assignShipmentsToDispatcher",urlEncodedParser, (req, res) => {


});

//assign shelfs to worker
router.post("/assignShelfsToWorker",urlEncodedParser, (req, res) => {
    let shelfs = "";
    for(const i in req.body.shelfs){
        shelfs += req.body.shelfs[i];
        if(i<req.body.shelfs.length-1)
            shelfs += ", ";
    }
    let workerSQL = "START TRANSACTION; \n";
    workerSQL += "UPDATE workerShelf\n SET workerID = "+ req.body.workerID +"\n WHERE shelfID IN( "+shelfs+ "); \n ";
    workerSQL += "UPDATE shelfupdate\n SET updatedBy = "+ req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shelfID IN("+shelfs+ "); \n ";
    workerSQL += "COMMIT; ";
    DB.query(workerSQL, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        }); 
    });
});

//assign shipments to worker 
router.post("/assignShipmentsToWorker",urlEncodedParser, (req, res) => {
    let shipments = "";
    for(const i in req.body.shipments){ 
        shipments += req.body.shipments[i];
        if(i<req.body.shipments.length-1)
        shipments += ", ";
    }

    let shipmentSQL =  "START TRANSACTION; \n";
    shipmentSQL += "UPDATE shipmentdelivery SET currentEmployee = "+ req.body.workerID +", deliveryStatus = '" + req.body.deliveryStatus + "', assignedEmployee = null WHERE shipmentID IN("+shipments+"); \n";
    shipmentSQL += "UPDATE shipmentupdate\n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shipmentID IN("+shipments+"); \n";
    for(let i =0;i<req.body.shipments.length;i++){
        shipmentSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, userAction, actor)\n VALUES("+req.body.shipments[i]+", (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), '"+time.getDateTime()+"', 'UPDATE', " + req.body.employeeID + "); \n";
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


module.exports = router; 