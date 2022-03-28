const conn = require('./accessibility/connection');
const fs = require('fs');

class User{
    constructor(firstName, lastName,email, phoneNumber){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
    trackShipment(shipmentID){ //returns that shipment's status
        //create connection
        const connection=conn.startConnection();
        //query setup
        const trackShipmentQuery = "SELECT status FROM shipments WHERE ShipmentID = " + shipmentID;
        const fileName = 'server/responses/track shipment/shipment' + shipmentID + '.json';
        // connect to database, write shipment's status into a file, then close the connection
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(trackShipmentQuery, (err, result,fields) => {
                    if (err) console.log("could not find shipment's status due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result), (err)=>{
                            if(err) console.log("could not save shipment's status in the JSON file due to some error in file system");
                            else console.log("shipments are successfully saved in: "+fileName);
                        });
                    }
                });
            }
            connection.end();
        });    
    }
}

module.exports = {
    User,
}