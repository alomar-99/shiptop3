const express = require('express');
const router = express.Router();
const DB = require('./tools/config').connection;
const time = require('./tools/utility');
const urlEncodedParser = require('./tools/config').middleware;

//add warehouse 
router.post("/addWarehouse",urlEncodedParser, (req, res) => {
    let warehouseSQL = "START TRANSACTION; \n";
    warehouseSQL += "INSERT INTO warehouse\n (city)\n VALUES ("+req.body.city+"); \n"
    warehouseSQL += "";



});

//modify warehouse 


//delete warehouse




//add warehouse worker
router.post("/addWorker",urlEncodedParser, (req, res) => {
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
                    employeeSQL += "INSERT INTO employee\n (firstName, lastName, role, email, phoneNumber, password)\n VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"'); \n";
                    employeeSQL += "INSERT INTO office\n (employeeID, location, telephone, roomNumber)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "', "+req.body.office.roomNumber+"); \n";
                    employeeSQL += "INSERT INTO employeeupdate\n (employeeID, updatedBy, lastUpdate)\n VALUES((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "'); \n";
                    employeeSQL += "INSERT INTO warehousemember\n (memberID,warehouseID)\n VALUES ((SELECT employeeID FROM employee WHERE email = '"+req.body.email+"'),"+req.body.warehouseID +"); \n";
                    employeeSQL += "COMMIT; "
                    console.log(employeeSQL);
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

// modify worker
router.post("/modifyWorker",urlEncodedParser, (req, res) => {
    const checkIDSQL = "SELECT * FROM employee WHERE employeeID = " +req.body.workerID;
    DB.query(checkIDSQL, (err, result)=>{
        if (err) throw err;
        let employeeSQL="";
        if (result=="")    
            res.send({ 
                "status": "ACC DOESN't EXIST", 
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
                    const checkEmailSQL = "SELECT employeeID FROM employee WHERE email ='" +req.body.email +"'";
                    DB.query(checkEmailSQL, (err, result)=>{ 
                    if (err) throw err;  
                    if (result[0]!=undefined){
                        if(result[0].employeeID!=req.body.workerID)
                            res.send({
                                "status": "DUPLICATE EMAIL", 
                                "err": true
                            });
                        else{
                            employeeSQL += "START TRANSACTION; \n" 
                            employeeSQL+= "UPDATE employee \n SET phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                            employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                            employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.workerID + ";\n";  
                            employeeSQL+= "UPDATE warehousemember \n SET warehouseID = " + req.body.warehouseID + "\n WHERE memberID = " + req.body.workerID + ";\n";

                            employeeSQL+= "COMMIT; ";

                            res.send(employeeSQL);
                            // DB.query(employeeSQL, (err)=>{
                            //     if (err) throw err; 
                            //     res.send({
                            //         "status": "SUCCESS", 
                            //         "err": false
                            //     });
                            // });
                        }
                    }
                    else{
                        employeeSQL += "START TRANSACTION; \n"; 
                        employeeSQL+= "UPDATE employee \n SET email= '"+ req.body.email +"', phoneNumber = '" + req.body.phoneNumber + "', password = '"+ req.body.password +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                        employeeSQL+= "UPDATE employeeupdate \n SET updatedBy = " + req.body.employeeID + ", lastUpdate = '"+ time.getDateTime() +"'\n WHERE employeeID = "+req.body.workerID + ";\n";
                        employeeSQL+= "UPDATE office \n SET location = '" + req.body.office.location +"', telephone = '" + req.body.office.telephone +"', roomNumber = "+ req.body.office.roomNumber +"\n WHERE employeeID = "+req.body.workerID + ";\n";
                        employeeSQL+= "COMMIT;";

                        // DB.query(employeeSQL, (err)=>{
                        //     if (err) throw err; 
                        //     res.send({
                        //         "status": "SUCCESS", 
                        //         "err": false
                        //     });
                        // });
                    }
                });
                }
            });
        }
    });
});

//delete worker


//view workers


//view unused warehouses


//assign to existing warehouse


//view shipments


//assign shipment to dispatcher



//assign shipment to worker 
router.post("/addWorker",urlEncodedParser, (req, res) => {



});



module.exports = router; 