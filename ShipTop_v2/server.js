//imports
const express = require('express');
const router = require("express").Router();
const bodyParser = require('body-parser');
// const conn = require('./routes/connection');

//import routers
const logisticManagerRouter = require('./routes/logisticManager')
const employeeRouter = require('./routes/employee')

// // middleware handler
// const urlEncodedParser = bodyParser.urlencoded({ extended: false })

//initializing express
const app = express();
const port = process.env.PORT || 3000;

//accepting json files
app.use(express.json());

//using routers
// app.use('/api/logisticManager',logisticManagerRouter);
app.use('/api/employee',employeeRouter);

// //create connection
// const connection = conn.startConnection();
// connection.connect(err => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("database connected successfully");
// });



//signIn for any employee
// router.post("/api/signIn",urlEncodedParser, (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;
//     let sql = "SELECT * FROM employees WHERE email = '" + email+ "' AND password = '"+ password +"'";
//     console.log(req.body);
    
//     connection.query(sql, (err, result)=>{
//         if (err) {
//             throw err;
//             console.log(err);
//         }
//             if (result=="")
//             response = "there are no employee with given info";
//             else{
//                 // response = {
//                         // "id" = 
//                 //     "email": "k8474@gmail.com",
//                 //     "password": "hud72947"
//                 // }
//                 console.log(result);
//             }
            
//         res.send(response);
//     });
// });

// //adding warehouseManager for any logistic manager
// router.post("/api/logisticManager/addWarehouseManager",urlEncodedParser, (req, res) => {
//     // const email = req.body.email;
//     // const password = req.body.password;
//     // const updatedBy = req.body
//     // let sql = "INSERT INTO warehousemanagers WHERE email = '" + email+ "' AND password = '"+ password +"'";
//     console.log(req.body);
    
//     // connection.query(sql, (err, result)=>{
//     //     if (err) {
//     //         throw err;
//     //         console.log(err);
//     //     }
//     //         if (result=="")
//     //         response = "there are no employee with given info";
//     //         else{
//     //             // response = {
//     //             //      "id" = 
//     //             //     "email": "k8474@gmail.com",
//     //             //     "password": "hud72947"
//     //             // }
//     //             console.log(result);
//     //         }
            
//     //     res.send(response);
//     // });
// });

//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
