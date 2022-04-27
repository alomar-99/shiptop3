const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add shipment 
router.post("/addOrder",urlEncodedParser,(req,res)=>{
    let shipmentSQL ="START TRANSACTION; \n";
    shipmentSQL += "INSERT INTO consignororder()VALUES(); \n";
    for(let x in req.body.shipments){
        shipmentSQL += "INSERT INTO shipment(shipmentName, category, isBreakable)VALUES('"+ req.body.shipments[x].shipmentName + "',  '"+req.body.shipments[x].category + "', "+req.body.shipments[x].isBreakable+"); \n";
        shipmentSQL += "INSERT INTO shipmentdetails(shipmentID, height, weight, width, length, description)VALUES((SELECT MAX(shipmentID) FROM shipment), ";
        shipmentSQL += req.body.shipments[x].details.height + ", " + req.body.shipments[x].details.weight + ", " + req.body.shipments[x].details.width + ", "+ req.body.shipments[x].details.length + ", '" + req.body.shipments[x].details.description + "'); \n";
        shipmentSQL += "INSERT INTO shipmentupdate(shipmentID, updatedBy, lastUpdate)VALUES((SELECT MAX(shipmentID) FROM shipment), "+req.body.employeeID +", '"+ time.getDateTime() +"'); \n";
        shipmentSQL += "INSERT INTO shipmentdelivery(shipmentID, currentCity, assignedEmployee) VALUES((SELECT MAX(shipmentID) FROM shipment), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), " + req.body.employeeID +"); \n"; 
        shipmentSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, action, actor) VALUES((SELECT MAX(shipmentID) FROM shipmentdelivery), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"),(SELECT lastUpdate FROM shipmentupdate WHERE shipmentID = (SELECT MAX(shipmentID) FROM shipmentdelivery)),'ADD', " + req.body.employeeID + "); \n";
    }
    shipmentSQL += "COMMIT; "
    console.log(shipmentSQL);
    DB.query(shipmentSQL,(err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});



module.exports = router;