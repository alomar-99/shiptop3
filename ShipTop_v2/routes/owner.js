const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;
const ownerCheck = require('./tools/utility').isOwner;

//add Administrator
router.post("/addAdministrator",urlEncodedParser, (req, res) => {
    //check if this admin is an owner
    DB.query(ownerCheck(req.body.employeeID), (err, result)=>{
        if (err) throw err;
        if (!result[0].IsOwner)
        res.send({
            "status": "NOT OWNER",  
            "err": true 
        }); 
        else{
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
                            employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'AD', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                            employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                            employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') , (SELECT MIN(employeeID) FROM employee WHERE role = 'AD'), '" + time.getDateTime() + "'); \n";
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
        } 
    });
});

//delete Administrator
router.post("/deleteAdministrator",urlEncodedParser, (req, res) => {
    //check if this admin is an owner
    DB.query(ownerCheck(req.body.employeeID), (err, result)=>{
        if (err) throw err;
        if (!result[0].IsOwner)
        res.send({
            "status": "NOT OWNER", 
            "err": true 
        });
        else{
            const errSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.adminID +" AND role = 'AD'";
            DB.query(errSQL, (err, result)=>{
                if (err) throw err;
                if (result=="")    
                    res.send({
                        "status": "ACC DOESN't EXIST", 
                        "err": true
                    });
                else{
                    const checkAdminsSQL = "SELECT IF(COUNT(employeeID)=1,true,false) AS restricted FROM employee WHERE role = 'AD'";
                    DB.query(checkAdminsSQL, (err,result)=>{
                        if (err) throw err;
                        if(result[0].restricted==1){
                            res.send({
                                "status": "RESTRICTED", 
                                "err": true 
                            }); 
                        }
                        else{
                            const employeeSQL = "DELETE FROM employee WHERE employeeID = "+req.body.adminID ;
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

//modify Administrator
router.post("/modifyAdministrator",urlEncodedParser, (req, res) => {
    //check if this admin is an owner
    DB.query(ownerCheck(req.body.employeeID), (err, result)=>{
        if (err) throw err;
        if (!result[0].IsOwner)
        res.send({
            "status": "NOT OWNER", 
            "err": true 
        });
        else{
            const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.adminID;
            DB.query(checkIDSQL, (err, result)=>{
                if (err) throw err;
                let employeeSQL="";
                if (result=="")    
                    res.send({ 
                        "status": "ACC DOESN't EXIST", 
                        "err": true
                    }); 
                else{
                    const checkLocationSQL = "SELECT * FROM office WHERE roomNumber = " +req.body.office.roomNumber+" AND location = '" + req.body.office.location +"' AND employeeID !=" +req.body.adminID;
                    DB.query(checkLocationSQL, (err,result)=>{
                        if (err) throw err;
                        if (result!="")
                            res.send({
                                "status": "DUPLICATE LOC", 
                                "err": true 
                            });
                        else{ 
                            const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"' AND employeeID !="+req.body.adminID;
                            DB.query(checkEmailSQL, (err, result)=>{ 
                            if (err) throw err;  
                            if(result[0]!=undefined)
                                res.send({
                                    "status": "DUPLICATE EMAIL", 
                                    "err": true
                                });
                            else{
                                employeeSQL+= "START TRANSACTION; \n" 
                                employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.adminID + ";\n";
                                employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.adminID + ";\n";
                                employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.adminID + ";\n";  
                                employeeSQL+= "UPDATE warehousemember \n SET warehouseID = " + req.body.warehouseID + "\n WHERE memberID = " + req.body.adminID + ";\n";
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
        }
    });
});

//view list of Administrators 
router.get("/viewAdministrators", (req,res) =>{
    //check if this admin is an owner
    DB.query(ownerCheck(req.query.employeeID), (err, result)=>{
        if (err) throw err;
        if (!result[0].IsOwner)
        res.send({
            "status": "NOT OWNER", 
            "err": true 
        });
        else{
            let SQL = "SELECT AD.*,\n ADof.location,ADof.roomNumber,ADof.telephone,\n ADup.updatedBy,ADup.lastUpdate\n FROM employee AD\n";
            SQL += "INNER JOIN employeeupdate ADup\n ON AD.employeeID = ADup.employeeID AND AD.role='AD'";
            SQL += "INNER JOIN office ADof\n ON AD.employeeID = ADof.employeeID AND AD.role='AD'";
            DB.query(SQL, (err,result)=>{
                if (err) throw err;
                res.send(result);
            });
        }
    });
});

module.exports = router;

