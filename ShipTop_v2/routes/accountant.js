const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add Rating
router.post("/addconsignorrate", urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID ='" + req.body.consignorID + "'";
    DB.query(checkIDSQL, (err, result) => {
        if (err) throw err;
        if (result != "") {

            let rateSQL = "START TRANSACTION; \n";
            rateSQL += "update  consignorrate set rate='" + req.body.rate + "', comment = '" + req.body.comment + "' WHERE employeeID = " + req.body.employeeID;
            DB.query(rateSQL, (err) => {
                if (err) throw err;
                res.send({
                    "status": "SUCCESS",
                    "err": false
                });
            });
        }

        else {

            //INSERT INTO  consignorrate (consignorID, rate, comment) values(req.body.consignorID,req.body.rate,req.body.comment);

            let rateSQL = "START TRANSACTION; \n";
            rateSQL += "INSERT INTO consignorrate (consignorID, rate, comment) VALUES('" + req.body.consignorID + "'," + req.body.rate, req.body.comment + "'); \n";
            DB.query(rateSQL, (err) => {
                if (err) throw err;
                res.send({
                    "status": "SUCCESS",
                    "err": false
                });
            });


        }
    });
});

module.exports = router;