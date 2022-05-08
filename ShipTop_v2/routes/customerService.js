const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

// add reportprint 
router.post("/addReportprint", urlEncodedParser, (req, res) => {
    let rateSQL = "INSERT INTO  reportprint (reportID, customerServerID, dateOfPrint)\n VALUES('" + req.body.reportID + "', '" + req.body.customerServerID + "','" + time.getDateTime();
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });
});

//delete reportprint 
router.post("/deleteReport",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM reportprint WHERE reportID = " +req.body.reportID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "Report print DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM report WHERE reportID = "+req.body.reportID ;
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

//view reportprints  

//add report
router.post("/addReport", urlEncodedParser, (req, res) => {
    let rateSQL = "INSERT INTO  report (reportID, reportType, reportPriority,subject,content)\n VALUES('" + req.body.reportID + "', '" + req.body.reportType + "','" + req.body.reportPriority + "','" + req.body.subject+"','" + req.body.content;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });

});

//modify report
router.post("/modifyReport", urlEncodedParser, (req, res) => {
    let rateSQL = "update report set reportType='" + req.body.reportType + "', reportPriority = '" + req.body.reportPriority +"', subject = '" + req.body.subject +"', content = '" + req.body.content +  "' WHERE reportID = " + req.body.reportID;
    DB.query(rateSQL, (err) => {
        if (err) throw err;
        res.send({
            "status": "SUCCESS",
            "err": false
        });
    });

});


//delete report
router.post("/deleteReport",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM report WHERE reportID = " +req.body.reportID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "Report DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM report WHERE reportID = "+req.body.reportID;
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

//view reports


module.exports = router;