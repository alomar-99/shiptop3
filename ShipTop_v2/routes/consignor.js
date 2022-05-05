const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add order 
router.post("/createOrder",urlEncodedParser,(req,res)=>{
    let orderSQL ="START TRANSACTION; \n";
    orderSQL += "INSERT INTO consignororder()VALUES(); \n";
    orderSQL += "INSERT INTO consignee (orderID, location, address, phoneNumber) VALUES ((SELECT MAX(ID) FROM consignororder), '" + req.body.location + "', '"+req.body.address + "', '" + req.body.phoneNumber + "'); \n";
    orderSQL += "INSERT INTO orderupdate(orderID, updatedBy, lastUpdate)VALUES((SELECT MAX(ID) FROM consignororder), "+req.body.employeeID +", '"+ time.getDateTime() +"'); \n";
    orderSQL += "SELECT MAX(co.ID) AS ID\n FROM consignororder co\n INNER JOIN orderupdate ord\n";
    orderSQL += "ON co.ID = ord.orderID AND ord.updatedBy = "+req.body.employeeID+"; \n";
    orderSQL += "COMMIT; "
    DB.query(orderSQL,(err,result)=>{
        if (err) throw err;
        res.send(result[4][0]);
    });
}); 

//add shipment 
router.post("/addShipment",urlEncodedParser,(req,res)=>{
    let shipmentSQL ="START TRANSACTION; \n";
    shipmentSQL += "INSERT INTO shipment(shipmentName, category, isBreakable)VALUES('"+ req.body.shipmentName + "',  '"+req.body.category + "', "+req.body.isBreakable+"); \n";
    shipmentSQL += "INSERT INTO shipmentdetails(shipmentID, height, weight, width, length, description)VALUES((SELECT MAX(shipmentID) FROM shipment), ";
    shipmentSQL += req.body.height + ", " + req.body.weight + ", " + req.body.width + ", "+ req.body.length + ", '" + req.body.description + "'); \n";
    shipmentSQL += "INSERT INTO shipmentupdate(shipmentID, updatedBy, lastUpdate)VALUES((SELECT MAX(shipmentID) FROM shipment), "+req.body.employeeID +", '"+ time.getDateTime() +"'); \n";
    shipmentSQL += "INSERT INTO shipmentdelivery(shipmentID, currentCity, currentEmployee) VALUES((SELECT MAX(shipmentID) FROM shipment), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), " + req.body.employeeID +"); \n"; 
    shipmentSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, userAction, actor) VALUES((SELECT MAX(shipmentID) FROM shipment), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"),(SELECT lastUpdate FROM shipmentupdate WHERE shipmentID = (SELECT MAX(shipmentID) FROM shipmentdelivery)),'ADD', " + req.body.employeeID + "); \n";
    shipmentSQL += "INSERT INTO ordershipment(orderID, shipmentID) VALUES("+req.body.orderID+",(SELECT MAX(shipmentID) FROM shipment)); \n";
    shipmentSQL += "COMMIT; "
    DB.query(shipmentSQL,(err)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});  


//cancel order
router.post("/cancelOrder", urlEncodedParser, (req, res) => {
    let cancelSQL = "START TRANSACTION; \n";
    cancelSQL += "UPDATE shipmentdelivery SET deliveryStatus= 'CANCELED' WHERE shipmentID IN ((SELECT shipmentID FROM ordershipment WHERE orderID = "+req.body.orderID+")); \n";
    cancelSQL += "UPDATE shipmentupdate SET updatedBy = "+req.body.employeeID+", lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID IN ((SELECT shipmentID FROM ordershipment WHERE orderID = "+req.body.orderID+")); \n";
    cancelSQL += "UPDATE orderupdate SET updatedBy = "+req.body.employeeID+", lastUpdate = '"+time.getDateTime()+"' WHERE orderID = "+req.body.orderID+"; \n";
    cancelSQL += "COMMIT; ";
    DB.query(cancelSQL, (err) => {
        if (err) throw err; 
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});

//view orders
router.get("/viewOrders", (req, res) => {
    let orderSQL = "SELECT ord.*, count(ship.shipmentID) AS Total_shipment\n FROM consignororder ord\n INNER JOIN ordershipment ship\n INNER JOIN orderupdate upd\n ON upd.updatedBy = "+req.params.employeeID+" AND upd.orderID = ord.ID AND ship.orderID = ord.ID GROUP BY ord.ID"
    DB.query(orderSQL, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//rate service
router.post("/rateService", urlEncodedParser, (req, res) => {
    let rateSQL = "update consignorrate set rate=" + req.body.rate + ", comment = '" + req.body.comment + "' WHERE employeeID = " + req.body.employeeID;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});

module.exports = router;