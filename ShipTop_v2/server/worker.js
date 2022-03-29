const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const warehouseMember = require('./warehouseMember');
const fs = require('fs');

class Worker extends warehouseMember.warehouseMember {
    constructor(firstName, lastName, email, phoneNumber, password, warehouseID) {
        super(firstName, lastName, email, phoneNumber, password);
        this.warehouseID = warehouseID;
    }
    locateShipmet(shipment,shelf){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myShelf = shelf.toArray();
        let shelfQuery = "UPDATE shelfs SET ";
        for (let i = 0; i < myShelf[0].length-2; i++){
            shelfQuery += myShelf[0][i];
            shelfQuery += "=";
            if (Number(myShelf[1][i])>=0)
                shelfQuery += myShelf[1][i];
            else{
                shelfQuery += "'";
                shelfQuery += myShelf[1][i];
                shelfQuery += "'";
            }
            shelfQuery += ", ";
        }
        shelfQuery += 'isReserved = ' + true;
        shelfQuery += ', shipmentID = ' +shipment.shipmentID;
        shelfQuery += ', workerID = ' + this.workerID;
        shelfQuery += ', lastUpdate = ' +"'" + today + "'";
        shelfQuery += " Where " + myShelf[0][0] + " = " + myShelf[1][0];
        // connect to database, add this shipment, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(shelfQuery, (err,result,fields)=>{
                    if (err) console.log("your shipment failed to be added to shelf "+shelf.shelfNumber);
                    else console.log("your shipment is successfully added to shelf "+shelf.shelfNumber);
                });
            }
            connection.end();
        });
    }
    clearShelf(shelf){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myShelf = shelf.toArray();
        let shelfQuery = "UPDATE shelfs SET ";
        for (let i = 0; i < myShelf[0].length-2; i++){
            shelfQuery += myShelf[0][i];
            shelfQuery += "=";
            if (Number(myShelf[1][i])>=0)
                shelfQuery += myShelf[1][i];
            else{
                shelfQuery += "'";
                shelfQuery += myShelf[1][i];
                shelfQuery += "'";
            }
            shelfQuery += ", ";
        }
        shelfQuery += 'isReserved = ' + false;
        shelfQuery += ', shipmentID = ' + null;
        shelfQuery += ', workerID = ' + this.workerID;
        shelfQuery += ', lastUpdate = ' +"'" + today + "'";
        shelfQuery += " Where " + myShelf[0][0] + " = " + myShelf[1][0];
        console.log(shelfQuery);
        // connect to database, add this shipment, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(shelfQuery, (err,result,fields)=>{
                    if (err) console.log("shelf "+shelf.shelfNumber+" failed to be cleared");
                    else console.log("shelf "+shelf.shelfNumber+" is successfully cleared");
                });
            }
            connection.end();
        });
    }
    viewShelfs(isReserved){

        //handling inappropriate input
        if(isReserved!=null && isReserved!=0 && isReserved!=1){
            console.log("please try again and enter a valid value");
            return
        }
        //create connection
        const connection=conn.startConnection();
        //query setup
        let viewShelfsQuery = "SELECT * FROM shelfs WHERE warehouseID = " + this.warehouseID;
        //" stat" + isReserved +
        let fileName = 'server/responses/view shelfs/warehouse' + this.warehouseID;
        if(isReserved!=null){
            viewShelfsQuery += " AND isReserved = " + isReserved;
            fileName += " stat" + Number(isReserved);
        }
        fileName+= '.json';
        //connect to database, write shipments into a file, then close the connection
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(viewShelfsQuery, (err, result,fields) => {
                    if (err) console.log("could not find shelfs' list due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result), (err)=>{
                            if (err) console.log("could not save shelfs' list in the JSON file due to some error in file system");
                            else console.log("shelfs' list are successfully saved in: " + fileName);
                        });
                    }
                });
            }
            connection.end();
        });
    }

    toArray(){
        const pair = [];
        const keys=['firstName','lastName','email','phoneNumber','password','warehouseID'];
        const values=[this.firstName,this.lastName,this.email,this.phoneNumber,this.password,this.warehouseID];
        pair.push(keys);
        pair.push(values);
        return pair;
    }

    toJSON(){


    }
}

module.exports = {
    Worker,
}