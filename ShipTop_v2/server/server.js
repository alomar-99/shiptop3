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

// signIn for any employee
app.post("/api/employee/signIn",urlEncodedParser, (req, res) => {
    let sql = "SELECT * FROM employees WHERE email = '" + req.body.email + "' AND password = '"+ req.body.password +"'";
    connection.query(sql, (err, result)=>{
        if (err) {
            throw err;
            console.log(err);
        }
            if (result=="")response ={"Error": "there are no employee with given info"};
            else response = result[0];
            res.send(response);
    });
});

//adding warehouseManager for any logistic manager
app.post("/api/logisticManager/addWarehouseManager",urlEncodedParser, (req, res) => {
    today = time.getDateTime();
    let sql = "INSERT INTO warehousemanagers('firstName','lastName','email','phoneNumber','password','warehouseID','lastUpdate')"+
    "values("+"'"+ req.params.firstName +"', " + req.params.lastName + "', " + req.params.email + "', " + req.params.phoneNumber + "', " + req.params.password + "', " + req.params.warehouseID +"', "+ today+"')"
    console.log(sql);
    
    // connection.query(sql, (err, result)=>{
    //     if (err) {
    //         throw err;
    //         console.log(err);
    //     }
    //         if (result=="")
    //         response = "there are no employee with given info";
    //         else{
    //             // response = {
    //             //      "id" = 
    //             //     "email": "k8474@gmail.com",
    //             //     "password": "hud72947"
    //             // }
    //             console.log(result);
    //         }
            
    //     res.send(response);
    // });
});

//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
