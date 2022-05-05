const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;


//deliver shipments
router.post("/deliverShipments",urlEncodedParser, (req, res) => {
    for(const i in req.body.shipmentID){
        let checkDestinationSQL = "SELECT IF(assignedEmployee="+req.body.employeeID+" ,\n (SELECT DISTINCT location\n From consignee co\n";
        checkDestinationSQL += "INNER JOIN ordershipment ord\n INNER JOIN shipmentdelivery ship\n ON ord.orderID = co.orderID\n AND ord.shipmentID = ship.shipmentID\n AND ship.currentEmployee = "+req.body.employeeID+"),\n";
        checkDestinationSQL += "(SELECT DISTINCT location \n FROM warehouse wa\n INNER JOIN warehousemember wam\n INNER JOIN shipmentdelivery ship \n ON ship.assignedEmployee = wam.memberID\n ";
        checkDestinationSQL += "AND wam.warehouseID = wa.warehouseID\n AND currentEmployee = "+req.body.employeeID+"\n )) AS destination\n FROM shipmentdelivery\n WHERE currentEmployee = "+req.body.employeeID + "\n AND shipmentID =" + req.body.shipmentID[i] + "\n";
        DB.query(checkDestinationSQL, (err,result)=>{
            if (err) throw err;
            if(result!=""){
                let deliverySQL = "START TRANSACTION; \n"; 
                deliverySQL += "UPDATE shipmentdelivery\n SET currentEmployee = assignedEmployee, deliveryStatus = 'DELIVERED', currentCity = '" + result[0].destination + "', deliveryDate = '"+ time.getDateTime() + "'\n WHERE shipmentID =" + req.body.shipmentID[i] +"; \n";
                deliverySQL += "UPDATE shipmentupdate\n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE shipmentID = " + req.body.shipmentID[i]+"; \n";
                deliverySQL += "UPDATE vehicle\n SET currentLocation = "+result[0].destination+"\n WHERE vehicleID = (SELECT vehicleID FROM vehicledriver WHERE driverID = "+req.body.employeeID+"); \n";
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

//viewShipments
router.get("/viewShipments", (req, res) => {
    let shipmentSQL = "SELECT shipmentID, deliveryDate, deliveryStatus,\n IF(assignedEmployee="+req.params.employeeID+" ,\n (SELECT DISTINCT address\n From consignee co\n";
    shipmentSQL += "INNER JOIN ordershipment ord\n INNER JOIN shipmentdelivery ship\n ON ord.orderID = co.orderID\n AND ord.shipmentID = ship.shipmentID\n AND ship.currentEmployee = "+req.params.employeeID+"),\n";
    shipmentSQL += "(SELECT DISTINCT address \n FROM warehouse wa\n INNER JOIN warehousemember wam\n INNER JOIN shipmentdelivery ship \n ON ship.assignedEmployee = wam.memberID\n ";
    shipmentSQL += "AND wam.warehouseID = wa.warehouseID\n AND currentEmployee = "+req.params.employeeID+"\n )) AS destination\n FROM shipmentdelivery\n WHERE currentEmployee = "+req.params.employeeID
    DB.query(shipmentSQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});            

module.exports = router;