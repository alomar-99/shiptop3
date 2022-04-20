//imports
const express = require('express');
const bodyParser = require('body-parser');
const conn = require('./connection');
const time = require('./server/accessibility/utility');
// const router = require("express").Router();

// middleware handler
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

//initializing express
const app = express();
const port = process.env.PORT || 3000;

//accepting json files
app.use(express.json());

//create connection
const connection = conn.startConnection();
connection.connect(err => {
    if (err) {
        console.log(err);
    }
    console.log("database connected successfully");
});

//EMPLOYEE //////////////////////////////////////////////////////
// sign in for any employee
app.post("/api/employee/signIn",urlEncodedParser, (req, res) => {
    let sql = "SELECT * FROM employees WHERE email = '" + req.body.email + "' AND password = '"+ req.body.password +"'";
    connection.query(sql, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
            if (result=="")response ={
                "status": "ACC DOESN't EXIST", 
                "err": true
            };
            else response = result[0];
            res.send(response);
    });
});

//LOGISTIC MANAGER //////////////////////////////////////////////////////
//adding warehouseManager for any logistic manager
app.post("/api/logisticManager/addWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(result[0]);
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "INSERT INTO warehousemanagers(firstName, lastName, email, phoneNumber, password, warehouseID, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', " + req.body.warehouseID +", '"+ today+"')"
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = "INSERT INTO employees(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'LM" + req.body.employeeID +"', '"+ today+"')"
            connection.query(employeeSQL, (err)=>{
                if (err) {
                    console.log(employeeSQL);
                    console.log(err);
                    throw err;
                }
            });
        }
    });
});

//updating warehouseManager for any logistic manager
app.post("/api/logisticManager/modifyWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employees WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(result[0]);
        if (result=="")    
            res.send({
                "status": "ACC DOESN't EXIST", 
                "err": true
            });
        else{
            today = time.getDateTime();
            const sql = "UPDATE warehousemanagers SET (firstName, lastName, email, phoneNumber, password, warehouseID, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', " + req.body.warehouseID +", '"+ today+"')"
            connection.query(sql, (err)=>{
            if (err) {
                console.log(err);
                throw err;
            }
            res.send({
                "status": "SUCCESS", 
                "err": false
            });
            });
            const employeeSQL = " UPDATE employees SET(firstName, lastName, email, phoneNumber, password, updatedBy, lastUpdate)"+ "values('"+ req.body.firstName +"', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password + "', 'LM" + req.body.employeeID +"', '"+ today+"')"
            connection.query(employeeSQL, (err)=>{
                if (err) {
                    console.log(employeeSQL);
                    console.log(err);
                    throw err;
                }
            });
        }
    });
});











//DRIVER //////////////////////////////////////////////





//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
