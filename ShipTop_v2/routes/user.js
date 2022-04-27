const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const urlEncodedParser = require('./tools/config').middleware;

//sign in for a specific employee
router.post("/signIn",urlEncodedParser, (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = '" + req.body.email + "' AND password = '"+ req.body.password +"'";
    DB.query(sql, (err, result)=>{
        if (err) throw err;
            if (result=="")
            response ={
                "status": "ACC DOESN't EXIST", 
                "err": true
            };
            else response = result[0];
            res.send(response);
    });
});

//track shipment for any user
router.get("/trackShipment", (req, res) => {
    let sql = "SELECT * FROM ";
    DB.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    });
});

module.exports = router;



