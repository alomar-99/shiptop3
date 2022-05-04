const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;


//deliver shipment
router.post("/deliverShipment",urlEncodedParser, (req, res) => {
    let location = "";
    if (req.body.next == "CE") location = "(SELECT location FROM consignee WHERE orderID = (SELECT orderID FROM ordershipment WHERE shipmentID = "+req.body.shipmentID+"))"
    else location = "(SELECT location FROM office WHERE employeeID = "+req.body.next+")";

    let deliverySQL = "START TRANSACTION; \n"; 
    deliverySQL += "UPDATE shipmentdelivery SET currentCity = " + location + ", currentEmployee = "
    deliverySQL += "COMMIT; ";

});


//view assigned shipments
    //shipmentDelivery => shipmentID, date, city, status
    //employee => *
    //assigned employee => 
        // if WM =>
            //warehouse => location
            //office => phoneNumber
        // if LM => 
            //office => location, phoneNumber
        // if CE => 
            //consignee => *
        
router.get("/viewShipments", (req, res) => {
    let shipmentSQL = "";

});            


module.exports = router;