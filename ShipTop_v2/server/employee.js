const user = require('./user');

class Employee extends user.User {
    constructor(firstName, lastName,email, phoneNumber,password){
        super(firstName, lastName, email, phoneNumber);
        this.password = password;
    }
    login(){

    }
    changePassword(){

    }
    changeInfo(){

    }
}

module.exports = {
    Employee,
}