const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add invoice
router.post("/rateService", urlEncodedParser, (req, res) => {
  

    let rateSQL = "update  consignorrate set rate='" + req.body.rate + "', comment = '" + req.body.comment + "' WHERE employeeID = " + req.body.consignorID;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });

});


//delete invoice

//modify invoice
//view invoice
//view orders




module.exports = router;