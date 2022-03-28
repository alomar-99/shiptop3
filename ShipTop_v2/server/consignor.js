const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const employee = require('./employee');
const fs = require('fs');

class Consignor extends employee.Employee{
    constructor(consignorID,firstName,lastName,email,password,phoneNumber,rate){
        super(consignorID, firstName,lastName,email,password,phoneNumber);
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
        const consignorQuery = "UPDATE consignors SET rate = "+ rate + " WHERE consignorID = "+ this.consignorID; 
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(consignorQuery,(err, result,fields)=>{
                    if (err) console.log("your rate couldn't be updated due to some error in the query");
                    else console.log("your rate is up to date!");
                });
            }
            connection.end();
        });
    }
    
    toArray(){
        const pair = [];
        const keys=['consignorID','firstName','lastName','email','password','phoneNumber','rate'];
        const values=[this.userID,this.firstName,this.lastName,this.email,this.password,this.phoneNumber,this.rate];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}


module.exports = {
    Consignor,
}