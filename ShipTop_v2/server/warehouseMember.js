const employee = require('./employee');
const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const fs = require('fs');

class warehouseMember extends employee.Employee{
    constructor(warehouseMemberID, firstName, lastName, email, phoneNumber, password, warehouseID){
        super(warehouseMemberID, firstName, lastName, email, phoneNumber, password);
        this.warehouseID =warehouseID;
        this.warehouseMemberID = warehouseMemberID;
    }
    viewShipments(){
        //create connection
        const connection=conn.startConnection();
        //query setup
        const viewShipmentsQuery = "SELECT shipmentID FROM shipments WHERE warehouseID = " + this.warehouseID;
        const fileName = 'server/responses/view shipments/warehouse' + this.warehouseID + '.json';
        //connect to database, write shipments into a file, then close the connection
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(viewShipmentsQuery, (err, result,fields) => {
                    if (err) console.log("could not find shipments' list due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result), (err)=>{
                            if (err) console.log("could not save shipments' list in the JSON file due to some error in file system");
                            else console.log("shipments' list are successfully saved in: " + fileName);
                        });
                    }
                });
            }
            connection.end();
        });
    }
    editShipmentDetails(shipment){
         //create connection
        const connection=conn.startConnection()
        //get current date
        const today = utility.getDateTime();
         //setup query
        let myShipment = shipment.toArray();
        let shipmentQuery = "UPDATE shipments SET "
        for (let i = 1; i < myShipment[0].length; i++){
            shipmentQuery += myShipment[0][i];
            shipmentQuery += "=";
            if (Number(myShipment[1][i])>=0)
            shipmentQuery += myShipment[1][i];
            else{
                shipmentQuery += "'";
                shipmentQuery += myShipment[1][i];
                shipmentQuery += "'";
            }
                shipmentQuery += ", ";
        }
        shipmentQuery +=  'lastUpdate = ' +"'" + today + "'";
        shipmentQuery += " Where " + myShipment[0][0] + " = " + myShipment[1][0];

        //  connect to database, update this shipment, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(shipmentQuery,(err, result,fields)=>{
                    if (err) console.log("your shipment's details couldn't be updated due to some error in the query");
                    else console.log("your shipment's details are up to date!");
                })
            }
            connection.end();
        });
    }
    viewShipmentDetails(shipmentID){
        //create connection
        const connection=conn.startConnection();
        //query setup
        const viewShipmentsQuery = "SELECT * FROM shipments WHERE shipmentID = " + shipmentID;
        const fileName = 'server/responses/view shipment'+ "'" + 's details'+ '/shipment' + shipmentID + '.json';
        //connect to database, write shipments into a file, then close the connection
        connection.connect((err)=> {
            if (err) console.log("there is an error with connecting to database");
            else{
                connection.query(viewShipmentsQuery,(err, result,fields)=> {
                    if (err) ("could not view shipment's details due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result),(err)=>{
                            if(err) console.log("could not save shipment's details in the JSON file due to some error in file system");
                            else console.log("shipments are successfully saved in: "+ fileName);
                        });
                    }
                });
            }
            connection.end();
        });
    }

}

module.exports = {
    warehouseMember,
}