//imports
const mysql = require('mysql');
const bodyParser = require('body-parser');

// middleware handler
const middleware = bodyParser.urlencoded({ extended: false })

//connection creation link to database
const connection = mysql.createConnection({
    host: 'shiptop.cutl0z5usu28.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'BX7i-tZ!j=TM6XH',
    database: 'shiptop'
});

//start connecting to database using the previous link
connection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    } 
    console.log("database connected successfully");
});

//exports
module.exports = {
    connection,middleware,
}