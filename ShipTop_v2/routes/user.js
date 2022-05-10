const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const urlEncodedParser = require('./tools/config').middleware;
const ow = require('./tools/utility').defaultOW;

//sign in for a specific employee
router.post("/signIn",urlEncodedParser, (req, res) => {
    const sql = "SELECT employeeID, IF((SELECT MIN(employeeID)\n FROM employee\n WHERE role='AD')=(SELECT employeeID\n FROM employee\n WHERE email = \""+req.body.email+"\"\n AND password = \""+req.body.password+"\")\n AND role='AD','OW',role) AS role\n FROM employee WHERE email = \""+req.body.email+"\" AND password = \""+req.body.password+"\";";
    DB.query(sql, (err, result)=>{
        if (err) throw err;
            if (result=="" && !(req.body.email == ow.email && req.body.password == ow.password)){
                res.send({
                    "status": "ACC DOESN't EXIST", 
                    "err": true
                });
            }
            else if(result=="" && req.body.email == ow.email && req.body.password == ow.password){
                const checkAdmins = "SELECT COUNT(employeeID) AS ADNumber FROM employee WHERE role = 'AD'";
                DB.query(checkAdmins, (err,result2)=>{
                    if (err) throw err;
                    if (result2[0].ADNumber==0){
                        let newOwnerSQL = "START TRANSACTION; \n";
                        newOwnerSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ow.firstName+"', '"+ow.lastName+"', '"+ow.role+"', '"+ow.email+"', '"+ow.phoneNumber+"', '"+ow.password+"'); \n";
                        newOwnerSQL += "SELECT employeeID, MIN(employeeID) FROM employee WHERE email = '"+ow.email+"' AND password = '"+ow.password+"'; \n";
                        newOwnerSQL += "COMMIT; \n"
                        DB.query(newOwnerSQL, (err,result3)=>{
                            if (err) throw err;
                            res.send({
                                "employeeID": result3[1].employeeID, 
                                "role": "OW"
                            });  
                        });
                    }
                    else{
                        res.send({
                            "status": "NOT OWNER", 
                            "err": true
                        });
                    }
                });
            }
            else{
                res.send(result[0]);
            }
    });
});

//track shipment for any user
router.get("/trackShipment", (req, res) => {
    let sql = "SELECT recordedPlace, recordedTime FROM shipmentrecord WHERE shipmentID = " + req.body.shipmentID;
    DB.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    });
});

module.exports = router;



