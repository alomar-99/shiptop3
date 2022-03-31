const user = require('./user');
const conn = require('./accessibility/connection');
const fs = require('fs');

class Employee extends user.User {
    constructor(employeeID, firstName, lastName,email, phoneNumber,password){
        super(firstName, lastName, email, phoneNumber);
        this.employeeID = employeeID;
        this.password = password;
    }

    login(){

    }

    changePassword(password){
        //create connection
        const connection=conn.startConnection();

        //setup query
        const role = this.toArray()[0][0].substring(0,this.toArray()[0][0].length-2);
        const userQuery = "UPDATE "+role+"s SET password = '"+password+"' WHERE "+role+"ID = "+this.userID;
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(userQuery, (err, result,fields)=>{
                    if (err) console.log("your password could not be changed due to some error in the query");
                    else console.log("your password is successfully updated");
                });
            }
            connection.end();
        });
    }

    changeInfo(){

    }

    
}

module.exports = {
    Employee,
}