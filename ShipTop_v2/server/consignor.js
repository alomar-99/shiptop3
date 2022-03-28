const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const employee = require('./employee');
const fs = require('fs');

class Consignor extends employee.Employee{
    constructor(consignorID,firstName,lastName,email,password,phoneNumber,rate){
        super(firstName,lastName,email,password,phoneNumber);
        this.consignorID = consignorID;
        this.rate = rate;
    }

    addShipment(shipment){

    }

    editShipment(shipment){

    }

    viewShipmentHistory(shipment){

    }

    rateService(rate){
        //create connection
        const connection=conn.startConnection();
        //setup query
        let consignorQuery = "UPDATE consignors SET rate = "+ rate + " WHERE consignorID = "+ this.consignorID; 
        



    }
    
    toArray(){
        const pair = [];
        const keys=['consignorID','firstName','lastName','email','password','phoneNumber','rate'];
        const values=[this.consignorID,this.firstName,this.lastName,this.email,this.password,this.phoneNumber,this.rate];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}


module.exports = {
    Consignor,
}