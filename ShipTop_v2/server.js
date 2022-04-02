//imports
const express = require('express');
const bodyParser = require('body-parser');
const conn = require('./server/accessibility/connection');

const warehouseManager = require('./server/warehouseManager');

//initializing express
const app = express();
const port = process.env.PORT || 3000;

// middleware handler
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

//handling POST requests
// app.post('/', urlEncodedParser,function (req, res) {
//     console.log(req.body);
//     console.log("hi")
//     res.send("post recieved")
// })
//


const slash = '/';
const role = 'warehouseManager';
const method = 'addWorker'
const path = slash + role + slash + method;

//create connection
const connection = conn.startConnection();
connection.connect(err => {
    if (err) {
        console.log(err);
    }
    console.log("database connected successfully");
})

// app.get(path+"/:workerID", (req, res)=>{
//     let worker = {
//     firstName:'khalid',
//     lastName:'qasim',
//     email:'k8474@gmail.com',
//     phoneNumber:'966548546325',
//     password:'hud72947', 
//     warehouseID:78948
//     } 

//     let sql = 'SELECT firstName FROM workers WHERE workerID = ' + req.params.workerID;
//     console.log(sql);
//     let query = connection.query(sql,worker, (err, result)=>{
//         if (err) {
//             throw err;
//         }
//         console.log(result);
//         res.send("worker is added");
//     });

// });

let worker = {
    firstName: 'khalid',
    lastName: 'qasim',
    email: 'k8474@gmail.com',
    phoneNumber: '966548546325',
    password: 'kiugh525',
    warehouseID: 78948
}

let user = {
    email: 'k8474@gmail.com',
    password: 'kiugh525'
}

app.post("/signIn", urlEncodedParser, (req, res) => {

    // let email = req.body.email;
    // let password = req.body.password;
    // let sql = "SELECT * FROM employees WHERE email = '" + email+ "' AND password = '"+ password +"'";
    // console.log(sql);
    console.log(req.body);
    res.json(req.body)
    // let query = connection.query(sql, (err, result)=>{
    //             if (err) {
    //                 throw err;
    //             }
    //             console.log(result);
    //             res.send("signed in successfully");

    //         });

});


//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
