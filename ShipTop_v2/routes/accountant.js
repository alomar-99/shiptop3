const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;
//
//add invoice
router.post("/addInvoice", urlEncodedParser, (req, res) => {
  

    let rateSQL = "INSERT INTO  invoice (invoiceID, date, paymentMethod)\n VALUES('"+ req.body.invoiceID +"', '" + time.getDateTime()+"','"+ req.body.paymentMethod +"','"+ req.body.paymentMethod;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });

});

//modify invoice
router.post("/modifyInvoice", urlEncodedParser, (req, res) => {
  

    let rateSQL = "update  invoice set paymentMethod='" + req.body.paymentMethod + "', amount = '" + req.body.amount + "' WHERE invoiceID = " + req.body.invoiceID;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });

});


//delete invoice
router.post("/deleteInvoice",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE invoiceID = " +req.body.invoiceID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "Invoice DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE invoiceID = "+req.body.invoiceID ;
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
//view invoice
//view orders




module.exports = router;