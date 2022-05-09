//imports
const mysql = require('mysql');
const bodyParser = require('body-parser');

// middleware handler
const middleware = bodyParser.urlencoded({ extended: false })

//connection details
const connectionInfo = {
    connectionLimit : 1,
    host: 'shiptop.cutl0z5usu28.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'BX7i-tZ!j=TM6XH',
    database: 'shiptop',
    multipleStatements: true
};

//connection creation link to database
const dbConnection = mysql.createConnection(connectionInfo);

//start connecting to database using the previous link
dbConnection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    } 
    console.log("database connected successfully");
});

//create pool
const connection = mysql.createPool(connectionInfo);

// Attempt to catch disconnects 
connection.on('connection',  (conn) => {
    console.log('DB Connection established');
    conn.on('error',  (err) => {
        console.error(new Date(), 'MySQL error', err.code);
    });
    conn.on('close', (err) => {
        console.error(new Date(), 'MySQL close', err);
    });
});

//exports
module.exports = {
    connection,middleware,
} 