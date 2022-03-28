const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const employee = require('./employee');
const fs = require('fs');


class Accountant extends employee.Employee {
    constructor(accountantID, firstName, lastName, email, phoneNumber, password){
        super(firstName, lastName, email, phoneNumber,password);
        this.accountantID = accountantID
    }

    addInvoice(invoice){

    }

    modifyInvoice(invoice){

    }

    deleteInvoice(invoice){

    }

    viewInvoice(invoice){
        
    }

    viewInvoiceList(){

    }

    generateConsigneeReport(){

    }

    generateOperationalCost(){

    }

    toArray(){
        const pair = [];
        const keys=['accountantID', 'firstName', 'lastName', 'email', 'phoneNumber', 'password'];
        const values=[this.accountantID, this.firstName, this.lastName, this.email, this.phoneNumber, this.password];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    Accountant,
}