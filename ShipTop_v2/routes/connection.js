
function startConnection(){
    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'shiptop'
    });
    return mysql.createPool(connection);
}


module.exports = {
    startConnection,
}