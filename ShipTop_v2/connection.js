
function startConnection(){
    const mysql = require('mysql');
    return mysql.createConnection({
        host: 'shiptop.cutl0z5usu28.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'BX7i-tZ!j=TM6XH',
        database: 'shiptop'
    });
}
const bodyParser = require('body-parser');

//create connection
const connection = startConnection();
connection.connect(err => {
    if (err) {
        console.log(err);
    } 
    console.log("database connected successfully");
});

// middleware handler
const middleware = bodyParser.urlencoded({ extended: false })

module.exports = {
    connection,startConnection,middleware
}