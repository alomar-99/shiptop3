const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const warehouseMember = require('./warehouseMember');
const fs = require('fs');

class warehouseManager extends warehouseMember.warehouseMember {
    constructor(warehouseManagerID,firstName, lastName,email,phoneNumber,password,warehouseID){
        super(warehouseManagerID,firstName, lastName, email, phoneNumber,password,warehouseID);
    }
    addShipment(shipment){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myShipment = shipment.toArray();
        let shipmentQuery = "INSERT into shipments(";
        for (let i = 0; i < myShipment[0].length; i++){
                shipmentQuery += myShipment[0][i];
            if (i< myShipment[0].length-1)
                shipmentQuery += ", ";
        }
        shipmentQuery += ', warehouseID';
        shipmentQuery += ', lastUpdate';
        shipmentQuery += ')values(';
        for (let i = 0; i < myShipment[1].length; i++){
            if (Number(myShipment[1][i])>=0 && String(myShipment[1][i]).length<10)
                shipmentQuery += myShipment[1][i];
            else
            {
                shipmentQuery += "'";
                shipmentQuery += myShipment[1][i];
                shipmentQuery += "'";
            }
                shipmentQuery += ", ";
        }
        shipmentQuery += this.warehouseID;
        shipmentQuery += ", '"+today+"'" +')';
        //connect to database, add this shipment, then close the connection.
        connection.connect((err)=> {
            if (err) console.log("there is an error with connecting to database");
            else{
                connection.query(shipmentQuery, (err,result,fields)=>{
                    if (err) console.log("your shipment is failed to be added");
                    else console.log("your shipment is successfully added");
                });
            }
            connection.end();
        });
    }

    addConsignor(consignor){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myConsignor = consignor.toArray();
        let consignorQuery = "INSERT into consignors(";
        for (let i = 0; i < myConsignor[0].length; i++){
            consignorQuery += myConsignor[0][i];
            if (i< myConsignor[0].length-1)
            consignorQuery += ", ";
        }
        consignorQuery += ', lastUpdate';
            consignorQuery += ')values(';
        for (let i = 0; i < myConsignor[1].length; i++){
            if (Number(myConsignor[1][i])>=0 && String(myConsignor[1][i]).length<10)
            consignorQuery += myConsignor[1][i];
            else
            {
                consignorQuery += "'";
                consignorQuery += myConsignor[1][i];
                consignorQuery += "'";
            }
            consignorQuery += ", ";
        }
        consignorQuery += "'"+today+"'" +')';
        //setUp User query
        let userQuery = "INSERT into users(userID, firstName, lastName, email, phoneNumber, role, lastUpdate) values(";
        userQuery += userID+", '"+consignor.firstName + "', '" + consignor.lastName + "', '"+consignor.email+ "', '"+ consignor.phoneNumber  + "', "; 
        userQuery += "'consignor', " + "'"+today+"'" +')';
        //connect to database, add this consignor, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(consignorQuery, (err,result,fields)=>{
                    if (err) console.log("your consignor is failed to be added");
                    else console.log("your consignor is successfully added");
                });
                connection.query(userQuery, (err,result,fields)=>{
                    if (err) console.log("your consignor is failed to be added as a user");
                    else console.log("your consignor is successfully added as a user");
                });
            }
            connection.end();
        });
    }

    deleteConsignor(consignor){
        //create connection
        const connection=conn.startConnection();
        //setup query
        let myWorker = consignor.toArray();
        let consignorQuery = "DELETE from consignors where consignorID= " + "'" +  consignor.consignorID + "'";
        //setUp User query
        let userQuery = "DELETE from users where userID= " + "'" +  consignor.consignorID + "'";
        //connect to database, delete this worker, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(consignorQuery, (err,result,fields)=>{
                    if (err) console.log("your consignor is failed to be removed");
                    else console.log("your consignor is successfully removed");
                });
                connection.query(userQuery, (err,result,fields)=>{
                    if (err) console.log("your consignor is failed to be removed as a user");
                    else console.log("your consignor is successfully removed as a user");
                });
            }
            connection.end();
        });
    }

    viewWorkers(){
        //create connection
        const connection=conn.startConnection();
        //query setup
        const viewWorkersQuery = "SELECT * FROM workers WHERE warehouseID = " + this.warehouseID;
        const fileName = 'server/responses/view workers/warehouse' + this.warehouseID + '.json';
        //connect to database
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(viewWorkersQuery, (err, result,fields) => {
                    if (err) console.log("could not find workers' list due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result), (err)=>{
                            if (err) console.log("could not save workers' list in the JSON file due to some error in file system");
                            else console.log("workers' list are successfully saved in: " + fileName);
                        });
                    }
                });
            }
            connection.end();
        });
    }

    viewConsignorsList(){

    }

    addWorker(worker){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myWorker = worker.toArray();
        let workerQuery = "INSERT into workers(";
        for (let i = 0; i < myWorker[0].length; i++){
                workerQuery += myWorker[0][i];
            if (i< myWorker[0].length-1)
                workerQuery += ", ";
        }
            workerQuery += ', lastUpdate';
            workerQuery += ')values(';
        for (let i = 0; i < myWorker[1].length; i++){
            if (Number(myWorker[1][i])>=0 && String(myWorker[1][i]).length<10)
                workerQuery += myWorker[1][i];
            else
            {
                workerQuery += "'";
                workerQuery += myWorker[1][i];
                workerQuery += "'";
            }
                workerQuery += ", ";
        }
        workerQuery += "'"+today+"'" +')';
        //setUp User query
        let userQuery = "INSERT into users(userID, firstName, lastName, email, phoneNumber, role, lastUpdate) values(";
        userQuery += worker.userID+", '"+worker.firstName + "', '" + worker.lastName + "', '"+worker.email+ "', '"+ worker.phoneNumber  + "', "; 
        userQuery += "'worker', '"+today+"'" +')';
        //connect to database, add this worker, then close the connection.
        console.log(workerQuery);
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(workerQuery, (err,result,fields)=>{
                    if (err) console.log("your worker is failed to be added");
                    else console.log("your worker is successfully added");
                });
                connection.query(userQuery, (err,result,fields)=>{
                    if (err) console.log("your worker is failed to be added as a user");
                    else console.log("your worker is successfully added as a user");
                });
            }
            connection.end();
        });
    }

    editWorkersList(worker){

    }

    deleteWorker(worker){
        //create connection
        const connection=conn.startConnection();
        //setup query
        let myWorker = worker.toArray();
        let workerQuery = "DELETE from workers where workerID= " + "'" +  worker.workerID + "'";
        //setUp User query
        let userQuery = "DELETE from users where userID= " + "'" +  worker.workerID + "'";
        //connect to database, delete this worker, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(workerQuery, (err,result,fields)=>{
                    if (err) console.log("your worker is failed to be removed");
                    else console.log("your worker is successfully removed");
                });
                connection.query(userQuery, (err,result,fields)=>{
                    if (err) console.log("your worker is failed to be removed as a user");
                    else console.log("your worker is successfully removed as a user");
                });
            }
            connection.end();
        });
    }

    toArray(){
        const pair = [];
        const keys=['warehouseManagerID','firstName','lastName','phoneNumber','email','password','warehouseID'];
        const values=[this.userID,this.firstName,this.lastName,this.phoneNumber,this.email,this.password,this.warehouseID];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    warehouseManager,
}