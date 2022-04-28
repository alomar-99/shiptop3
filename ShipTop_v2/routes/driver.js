const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;


//deliver shipment


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
        
            


module.exports = router;