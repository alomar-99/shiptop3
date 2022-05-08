const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;
const equality = require('./tools/utility').equality;

//add order 
router.post("/createOrder",(req,res)=>{
    let orderSQL ="START TRANSACTION; \n"; 
    orderSQL += "INSERT INTO consignororder(consignorID)VALUES("+req.body.employeeID+"); \n";
    orderSQL += "INSERT INTO consignee (orderID, location, address, phoneNumber) VALUES ((SELECT MAX(ID) FROM consignororder), '" + req.body.location + "', '"+req.body.address + "', '" + req.body.phoneNumber + "'); \n";
    orderSQL += "INSERT INTO orderupdate(orderID, updatedBy, lastUpdate)VALUES((SELECT MAX(ID) FROM consignororder), "+req.body.employeeID +", '"+ time.getDateTime() +"'); \n";
    orderSQL += "INSERT INTO orderpayment(orderID)\n VALUES ((SELECT MAX(ID) FROM consignororder)); \n";
    for (const i in req.body.shipments){
        orderSQL += "INSERT INTO shipment(shipmentName, category, isBreakable)VALUES('"+ req.body.shipments[i].shipmentName + "',  '"+req.body.shipments[i].category + "', "+req.body.shipments[i].isBreakable+"); \n";
        orderSQL += "INSERT INTO shipmentdetails(shipmentID, height, weight, width, length, description)VALUES((SELECT MAX(shipmentID) FROM shipment), ";
        orderSQL += req.body.shipments[i].height + ", " + req.body.shipments[i].weight + ", " + req.body.shipments[i].width + ", "+ req.body.shipments[i].length + ", '" + req.body.shipments[i].description + "'); \n";
        orderSQL += "INSERT INTO shipmentupdate(shipmentID, updatedBy, lastUpdate)VALUES((SELECT MAX(shipmentID) FROM shipment), "+req.body.employeeID +", '"+ time.getDateTime() +"'); \n";
        orderSQL += "INSERT INTO shipmentdelivery(shipmentID, currentCity, currentEmployee, deliveryStatus) VALUES((SELECT MAX(shipmentID) FROM shipment), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"), " + req.body.employeeID +", 'NEW'); \n"; 
        orderSQL += "INSERT INTO shipmentrecord(shipmentID, recordedPlace, recordedTime, userAction, actor) VALUES((SELECT MAX(shipmentID) FROM shipment), (SELECT location FROM office WHERE employeeID = "+req.body.employeeID+"),(SELECT lastUpdate FROM shipmentupdate WHERE shipmentID = (SELECT MAX(shipmentID) FROM shipmentdelivery)),'ADD', " + req.body.employeeID + "); \n";
        orderSQL += "INSERT INTO ordershipment(orderID, shipmentID) VALUES((SELECT MAX(ID) FROM consignororder),(SELECT MAX(shipmentID) FROM shipment)); \n";
    }
    orderSQL += "COMMIT; "
    DB.query(orderSQL,(err,result)=>{
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
}); 

//cancel order
router.post("/cancelOrder", urlEncodedParser, (req, res) => {
    console.log(req.body)
    let cancelSQL = "START TRANSACTION; \n";
    cancelSQL += "UPDATE shipmentdelivery SET deliveryStatus= 'CANCELED' WHERE shipmentID IN ((SELECT shipmentID FROM ordershipment WHERE orderID = "+req.body.orderID+")); \n";
    cancelSQL += "UPDATE shipmentupdate SET updatedBy = "+req.body.employeeID+", lastUpdate = '"+time.getDateTime()+"' WHERE shipmentID IN ((SELECT shipmentID FROM ordershipment WHERE orderID = "+req.body.orderID+")); \n";
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
    let orderSQL = "SELECT ord.ID,isPaid, count(ship.shipmentID) AS Total_shipment\n FROM consignororder ord\n INNER JOIN ordershipment ship\n ON ord.consignorID = "+req.query.employeeID+"\n AND ship.orderID = ord.ID\n GROUP BY ord.ID"
    DB.query(orderSQL, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// view order details given an orderID
router.get("/viewOrder", (req, res) => {
    let orderSQL = "SELECT ord.ID, CE.location, CE.address, CE.phoneNumber, inv.date, inv.paymentMethod, inv.amount\n";
    orderSQL += ", count(ship.shipmentID) AS Total_shipment, count(del.shipmentID) AS deliveredShipments\n FROM consignororder ord";
    orderSQL += "INNER JOIN consignee CE\n INNER JOIN orderupdate upd\n INNER JOIN orderpayment pay\n ON upd.updatedBy = "+ req.query.employeeID + "\n";
    orderSQL += "AND ord.ID = "+req.query.orderID+"\n AND upd.orderID = ord.ID\n AND CE.orderID = ord.ID\n AND pay.orderID = ord.ID\n LEFT JOIN invoice inv\n";
    orderSQL += "ON pay.invoiceID = inv.invoiceID\n LEFT JOIN ordershipment ship\n ON ship.orderID = ord.ID\n LEFT JOIN shipmentdelivery del\n";
    orderSQL += "ON del.shipmentID = ship.shipmentID\n AND del.deliveryStatus = 'DELIVERED'\n GROUP BY ord.ID";
    DB.query(orderSQL, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// view Shipments provided an orderID
router.get("/viewShipments", (req, res) => {
    let shipmentsSQL = "SELECT ship.*, det.weight, det.length, det.width, det.height, det.description  ,del.deliveryStatus, del.deliveryDate, del.currentCity\n";
    shipmentsSQL += "FROM shipment ship\n INNER JOIN shipmentdelivery del\n INNER JOIN shipmentdetails det\n INNER JOIN ordershipment ord\n ON ship.shipmentID = del.shipmentID\n";
    shipmentsSQL += "AND ship.shipmentID = det.shipmentID\n AND ship.shipmentID = ord.shipmentID\n AND ord.orderID = "+req.query.orderID+"\n";
    //filter option
    for (const i in req.query.filteredBy){
        if((!(Object.keys(req.query.filteredBy[i]).length===0 && Object.getPrototypeOf(req.query.filteredBy[i]) === Object.prototype) && req.query.filteredBy[i]==""))
            if(typeof req.query.filteredBy[i] === "string")
                shipmentsSQL += " AND ship."+i+" = '"+req.query.filteredBy[i] + "' \n ";
            else shipmentsSQL += " AND ship."+i+" = "+req.query.filteredBy[i] + "\n ";
        if(i=="details")
        shipmentTable = "det";
        else if(i == "delivery")
        shipmentTable = "del";
        if(typeof req.query.filteredBy[i] === "object" && (!(Object.keys(req.query.filteredBy[i]).length===0 && Object.getPrototypeOf(req.query.filteredBy[i]) === Object.prototype)))
        for(const j in req.query.filteredBy[i]){
            value = equality(req.query.filteredBy[i],j)
            shipmentsSQL += " AND "+shipmentTable+"."+j+" "+ value + "\n ";
        }
    }
    DB.query(shipmentsSQL, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//rate service
router.post("/rateService", urlEncodedParser, (req, res) => {
    let rateSQL = "update consignorrate set rate=" + req.body.rate + ", comment = '" + req.body.comment + "' WHERE consignorID = " + req.body.consignorID;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});

module.exports = router;