const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add consignor
router.post("/addConsignor",urlEncodedParser, (req, res) => {
    const checkEmailSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    DB.query(checkEmailSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")     
            res.send({
                "status": "EXISTING ACC", 
                "err": true 
            }); 
        else{
            const checkLocationSQL = "SELECT employeeID FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"'";
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{
                    let employeeSQL = "START TRANSACTION; \n";
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'CO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,(SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
                    employeeSQL += "INSERT INTO consignorrate(consignorID)VALUE((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"')); \n";
                    employeeSQL += "COMMIT; "
                    DB.query(employeeSQL, (err)=>{
                        if (err) throw err;
                        res.send({
                            "status": "SUCCESS",
                            "err": false
                        });
                    });
                }
            });
        }
    });
});

//modifyConsignor
router.post("/modifyConsignor",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.consignorID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({ 
                "status": "ACC DOESN't EXIST", 
                "err": true
            }); 
        else{
            const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"' AND employeeID !=" +req.body.consignorID;
            DB.query(checkLocationSQL, (err,result)=>{
                if (err) throw err;
                console.log(result);
                if (result!="")
                    res.send({
                        "status": "DUPLICATE LOC", 
                        "err": true 
                    });
                else{ 
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.consignorID;
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if(result[0]!=undefined)
                        res.send({
                            "status": "DUPLICATE EMAIL", 
                            "err": true
                        });
                    else{
                        employeeSQL+= "START TRANSACTION; \n"; 
                        employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.consignorID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.consignorID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = (SELECT location FROM (SELECT location FROM office WHERE employeeID ="+req.body.employeeID+") AS LOC), telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.consignorID + ";\n";  
                        employeeSQL+= "COMMIT; ";
                        DB.query(employeeSQL, (err)=>{
                            if (err) throw err; 
                            res.send({
                                "status": "SUCCESS", 
                                "err": false
                            });
                        });
                    }
                });
                }
            });
        }
    });
});

//delete consignor
router.post("/deleteconsignor",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.consignorID;
    DB.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.consignorID ;
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

//view Consignors  
router.get("/viewConsignors", (req, res) =>{
    let SQL = "SELECT rate.rate, rate.comment, CO.*,\n COof.location,COof.roomNumber,COof.telephone,\n COup.updatedBy,COup.lastUpdate\n FROM employee CO\n";
    SQL += "INNER JOIN employeeupdate COup\n ON CO.employeeID = COup.employeeID\n";
    SQL += "INNER JOIN office COof\n ON CO.employeeID = COof.employeeID\n";
    SQL += "INNER JOIN office FBof\n ON FBof.employeeID = "+req.body.employeeID+" AND FBof.location = FBof.location\n";
    SQL += "INNER JOIN consignorrate rate\n ON rate.consignorID = CO.employeeID\n AND FBof.location = COof.location \n";
    DB.query(SQL, (err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});




module.exports = router;