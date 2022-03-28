
function startConnection(){
    const mysql = require('mysql');
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'shiptop'
    })
    return connection;
}

module.exports = {
    startConnection,
}