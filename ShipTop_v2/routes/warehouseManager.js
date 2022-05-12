const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const equality = require('./tools/utility').equality;
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
            DB.query(warehouseSQL, (err)=>{
                if (err) throw err;
            });
            let floor,lane,section,row,number = 0;
            let total =0;
            const limit = 6000; //max = 7500
            let bodyIncrement = 0;
            let maxShelfs = req.body.shelf.floors*req.body.shelf.lanes*req.body.shelf.sections*req.body.shelf.rows*req.body.shelf.number
            let shelfSQL="START TRANSACTION; \n";
            for(floor=1;floor<=req.body.shelf.floors; floor++){
                for(lane=1;lane<=req.body.shelf.lanes; lane++){
                    for(section=1;section<=req.body.shelf.sections; section++){
                        for(row=1;row<=req.body.shelf.rows; row++){
                            for(number=1;number<=req.body.shelf.number; number++){
                                if(bodyIncrement==limit){
                                    bodyIncrement=0; 
                                } 
                                shelfSQL += "INSERT INTO shelf(shelfID,width,height)\n VALUES("+total+1+","+req.body.shelf.width+", "+req.body.shelf.height+"); \n";
                                shelfSQL += "INSERT INTO shelfaddress\n (shelfID, shelfNumber, row, section, lane, floor, warehouseID)\n VALUES("+total+1+", "+number+", "+row+", " +section+", "+lane+", "+floor+", (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
                                shelfSQL += "INSERT INTO shelfupdate\n (shelfID, updatedBy, lastUpdate)\n VALUES("+total+1+", "+req.body.employeeID +", '"+time.getDateTime()+"'); \n";
                                shelfSQL += "INSERT INTO workerShelf\n (shelfID)\n VALUES("+total+1+"); \n";
                                shelfSQL += "INSERT INTO shelfreservation\n (shelfID)\n VALUES("+total+1+"); \n";
                                if(bodyIncrement==0||total==maxShelfs-1){
                                    shelfSQL += "COMMIT; ";
                                    console.log("floor ="+ floor +" lane =" + lane + " section = "+section + " row = "+row +" number = "+number+" total = "+total);
                                    DB.query(shelfSQL, (err)=>{
                                        if (err) throw err;
                                    }); 
                                    shelfSQL="START TRANSACTION; \n";
                                }
                                total++;
                                bodyIncrement++;
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

// //delete warehouse 
// router.post("/deleteWarehouse",urlEncodedParser, (req, res) => {
//     const checkWarehouseSQL = "SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID
//     DB.query(checkWarehouseSQL, (err,result)=>{
//         if (err) throw err;
//         if(result=="")
//         res.send({
//             "status": "WAREHOUSE DOESN't EXIST'", 
//             "err": true
//         });
//         else{ 
//             let warehouseSQL ="START TRANSACTION; \n";
//             warehouseSQL += "DELETE FROM shelf WHERE shelfID BETWEEN\n (SELECT MIN(shelfID) FROM shelfaddress WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+"))\n"
//             warehouseSQL += "AND (SELECT MAX(shelfID) FROM shelfaddress WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
//             warehouseSQL += "DELETE FROM warehouse WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+"); \n";
//             warehouseSQL += "DELETE FROM employee WHERE employeeID = (SELECT memberID FROM warehousemember WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")); \n";
//             warehouseSQL+= "COMMIT; ";
//             DB.query(warehouseSQL, (err)=>{
//                 if (err) throw err;
//                 res.send({
//                     "status": "SUCCESS", 
//                     "err": false
//                 });      
//             });
//         }      
//     });
// });

//view unused warehouses
router.get("/viewWarehouses", (res) => {
    const warehouseSQL = "SELECT wa.*\n FROM warehouse wa\n INNER JOIN warehousemember WAwm\n ON wa.warehouseID != WAwm.warehouseID\n INNER JOIN employee WM\n ON WM.role='WM' AND WM.employeeID = WAwm.memberID;";
    DB.query(warehouseSQL, (err,result)=>{
        if (err) throw err;
        res.send(result); 
    });
});

//assign to existing warehouse 
router.post("/assignToWarehouse",urlEncodedParser, (req, res) => {
    const checkWarehouseSQL = "SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID
    DB.query(checkWarehouseSQL, (err,result)=>{
        if (err) throw err;
        if(result!="")
            res.send({ 
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const checkManagerSQL = "SELECT * FROM employee WHERE employeeID = "+req.body.employeeID
            DB.query(checkManagerSQL, (err,result)=>{
                if (err) throw err;
                if(result=="")
                res.send({ 
                    "status": "ACC DOESN't EXIST'", 
                    "err": true 
                });
                else{
                    let warehouseSQL = "START TRANSACTION; \n";
                    warehouseSQL += "INSERT INTO warehousemember(memberID,warehouseID)\n VALUES("+req.body.employeeID+","+req.body.warehouseID+");\n";
                    warehouseSQL += "UPDATE warehouseupdate\n SET managerID = "+ req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"' WHERE warehouseID = "+ req.body.warehouseID+";\n";
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
        }
    })
}); 

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
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') , (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
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

//modify worker
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
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC) AND employeeID !=" +req.body.workerID;
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
                        employeeSQL+= "UPDATE office \n SET location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.workerID + ";\n";  
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
router.get("/viewWorkers", (req, res) => {
    let workerSQL = "SELECT WO.employeeID, WO.firstName,WO.lastName, WO.email,WO.phoneNumber, WO.password, WOof.location,WOof.roomNumber,WOof.telephone,\n";
    workerSQL += "WOup.updatedBy,WOup.lastUpdate, count(res.shelfID) AS assignedShelfs\n FROM employee WO\n INNER JOIN employeeupdate WOup\n INNER JOIN office WOof\n";
    workerSQL += "INNER JOIN warehousemember WAwm\n INNER JOIN warehousemember WAwo\n INNER JOIN employee WM\n ON WO.employeeID = WOup.employeeID\n AND WO.role = 'WO'\n";
    workerSQL += "AND WO.employeeID = WOof.employeeID\n AND WM.employeeID = "+req.query.employeeID+"\n AND WAwm.memberID = WM.employeeID\n AND WAwm.warehouseID = WAwo.warehouseID\n";
    workerSQL += "AND WAwo.memberID = WO.employeeID\n INNER JOIN workerShelf WOsh\n LEFT JOIN shelfreservation res\n ON WOsh.shelfID = res.shelfID\n AND WOsh.workerID = WO.employeeID\n GROUP BY WO.employeeID;";
    DB.query(workerSQL, (err,result)=>{
        if (err) throw err;        
        res.send(result); 
    });
});

//view shipments in a warehouse 
router.post("/viewShipments", (req, res) => {
    let shipmentTable ="";
    let value = "";
    let shipmentsSQL = "SELECT ship.*,ord.orderID, shipDet.description, shipDet.height, shipDet.length, shipDet.weight, shipDet.width,\n shipDel.currentCity, shipDel.deliveryDate, shipDel.deliveryStatus, shipDel.currentEmployee, shipDel.assignedEmployee,\n shipUp.updatedBy, shipUp.lastUpdate FROM shipment ship\n";
    shipmentsSQL += "INNER JOIN shipmentdetails shipDet\n INNER JOIN shipmentdelivery shipDel\n INNER JOIN shipmentupdate shipUp\n INNER JOIN ordershipment ord\n INNER JOIN warehousemember wawm \n";
    shipmentsSQL += "ON ship.shipmentID = shipDet.shipmentID\n AND ship.shipmentID = shipDel.shipmentID\n AND ship.shipmentID = shipUp.shipmentID\n AND ship.shipmentID = ord.shipmentID\n";
    shipmentsSQL += "AND (shipDel.deliveryStatus ='WAREHOUSE' OR shipDel.deliveryStatus ='ONROAD')\n  AND assignedEmployee = wawm.memberID\n AND wawm.memberID = "+req.body.employeeID + "\n ";
    for (const i in req.body.filteredBy){
        if((!(Object.keys(req.body.filteredBy[i]).length===0 && Object.getPrototypeOf(req.body.filteredBy[i]) === Object.prototype) && req.body.filteredBy[i]==""))
            if(typeof req.body.filteredBy[i] === "string")
                shipmentsSQL += " AND ship."+i+" = '"+req.body.filteredBy[i] + "' \n ";
            else shipmentsSQL += " AND ship."+i+" = "+req.body.filteredBy[i] + "\n ";
        if(i=="details") 
        shipmentTable = "shipDet";
        else if(i == "updates")
        shipmentTable = "shipUp";
        else if(i == "delivery") 
        shipmentTable = "shipDel";
        else if(i=="order")
        shipmentTable = "ord";
        if(typeof req.body.filteredBy[i] === "object" && (!(Object.keys(req.body.filteredBy[i]).length===0 && Object.getPrototypeOf(req.body.filteredBy[i]) === Object.prototype)))
        for(const j in req.body.filteredBy[i]){
            value = equality(req.body.filteredBy[i],j)
            shipmentsSQL += " AND "+shipmentTable+"."+j+" "+ value + "\n ";
        }
    }
    DB.query(shipmentsSQL, (err,result)=>{
        if (err) throw err;        
        res.send(result); 
    });
});

//assign shipments (to worker or driver)
router.post("/assignShipments",urlEncodedParser, (req, res) => {
    let stat = "";
    let checkDestinationSQL = "";
    let deliverySQL = "";
    for(const i in req.body.shipmentID){
        checkDestinationSQL = "SELECT deliveryStatus,\n IF(currentCity = (SELECT DISTINCT location\n From consignee co\n";
        checkDestinationSQL += "INNER JOIN ordershipment ord\n INNER JOIN shipmentdelivery ship\n ON ord.orderID = co.orderID\n AND ord.shipmentID = ship.shipmentID\n AND ship.currentEmployee = "+req.body.employeeID+"),\n";
        checkDestinationSQL += "'SAME','DIFF') AS isSame\n FROM shipmentdelivery\n WHERE currentEmployee = "+req.body.employeeID + "\n AND shipmentID =" + req.body.shipmentID[i] + "\n";
        DB.query(checkDestinationSQL, (err,result)=>{
            if (err) throw err;
            if(result!=""){
                stat = result[0].deliveryStatus
                if (stat=='ONROAD'){ 
                    stat = 'PICKUP';
                }
                else if(stat=='PICKEDUP'){
                    if (result[0].isSame="SAME") stat = 'TOBEDELIVERED';
                    else stat = 'TOBESTORED';
                }
                else if (stat=='WAREHOUSE'){
                    stat = 'TOBESTORED';
                }
                else{
                    stat = 'UNKNOWN'; 
                    city = "'UNKNOWN'";
                }
                deliverySQL = "START TRANSACTION; \n"; 
                deliverySQL += "UPDATE shipmentdelivery\n SET currentEmployee = "+req.body.assignedEmployeeID+", deliveryStatus = '"+stat+"', currentCity = (SELECT location FROM warehouse WHERE warehouseID = (SELECT warehouseID FROM warehousemember WHERE memberID = "+req.body.employeeID+")), deliveryDate = '"+ time.getDateTime() + "'\n WHERE shipmentID =" + req.body.shipmentID[i] +"; \n";
                deliverySQL += "UPDATE shipmentupdate\n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shipmentID = " + req.body.shipmentID[i]+"; \n";
                deliverySQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, userAction, actor)\n VALUES("+req.body.shipmentID[i]+", (SELECT currentCity FROM shipmentdelivery WHERE shipmentID = "+req.body.shipmentID[i]+"), '"+time.getDateTime()+"' ,'UPDATE', " + req.body.employeeID + "); \n";
                deliverySQL += "COMMIT; ";
                DB.query(deliverySQL, (err)=>{
                    if (err) throw err;   
                });
            }
        });
    }
    res.send({
        "status": "SUCCESS", 
        "err": false
    });
});

//view shelfs
router.get("/viewShelfs", (req, res) => {
    let shelfsSQL = "SELECT sh.*, wo.workerID AS assignedTo, addr.floor,addr.lane,addr.section,addr.row, addr.shelfNumber,\n";
    shelfsSQL += "upd.updatedBy, upd.lastUpdate , res.assignedShipment\n FROM shelf sh\n INNER JOIN shelfreservation res\n INNER JOIN workerShelf wo";
    shelfsSQL += "\n INNER JOIN shelfaddress addr\n INNER JOIN shelfupdate upd\n INNER JOIN warehousemember WM\n ON sh.shelfID = res.shelfID\n AND WM.warehouseID = addr.warehouseID\n";
    shelfsSQL += "AND sh.shelfID = upd.shelfID\n AND sh.shelfID = wo.shelfID\n AND sh.shelfID = addr.shelfID\n AND WM.memberID = "+req.query.employeeID+";\n";
    DB.query(shelfsSQL, (err,result)=>{
        if (err) throw err;        
        res.send(result); 
    });
});

//assign shelfs to worker
router.post("/assignShelfsToWorker",urlEncodedParser, (req, res) => {
    let shelfs = "";
    for(const i in req.body.shelfs){
        shelfs += req.body.shelfs[i];
        if(i<req.body.shelfs.length-1)
            shelfs += ", ";
    }
    let workerSQL = "START TRANSACTION;\n";
    workerSQL += "UPDATE workerShelf\n SET workerID = "+ req.body.workerID +"\n WHERE shelfID IN( "+shelfs+ "); \n";
    workerSQL += "UPDATE shelfupdate\n SET updatedBy = "+ req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shelfID IN("+shelfs+ "); \n";
    workerSQL += "COMMIT;";
    DB.query(workerSQL, (err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS", 
            "err": false
        }); 
    });
});

router.get("/checkWarehouse", (req, res) => {
    const checkWarehouseSQL = "SELECT warehouseID FROM warehousemember WHERE memberID = "+req.query.employeeID;
    DB.query(checkWarehouseSQL, (err, result) => {
        if (err) throw err;
        if(result[0].warehouseID==null)
        res.send({
            "status": "NOWAREHOUSE", 
            "err": true
        }); 
        else {
            res.send({
                "status":"WAREHOUSE",
                "err": true
            })
        }
    })
})
module.exports = router; 