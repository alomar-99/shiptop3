const router = require("express").Router();
const bodyParser = require('body-parser');
const conn = require('./connection');
// middleware handler
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

router.post("/signIn",urlEncodedParser, (req, res) => {

    //create connection
    const connection = conn.startConnection();
    connection.connect(err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("database connected successfully");
    });

    let email = req.body.email;
    let password = req.body.password;
    let sql = "SELECT * FROM employees WHERE email = '" + email+ "' AND password = '"+ password +"'";
    console.log(req.body);
    
    connection.query(sql, (err, result)=>{
        if (err) {
            throw err;
            console.log(err);
        }
            if (result=="")
            response = "there are no employee with given info";
            else
            response = "signed in successfully";
            res.send(response)
        });
    
    connection.end();
});

module.exports = router;