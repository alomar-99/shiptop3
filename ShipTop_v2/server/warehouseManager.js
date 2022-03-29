const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const warehouseMember = require('./warehouseMember');
const record = require('./record');
const fs = require('fs');

class warehouseManager extends warehouseMember.warehouseMember {
    constructor(firstName, lastName,email,phoneNumber,password,warehouseID){
        super(firstName, lastName, email, phoneNumber,password,warehouseID);
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
        shipmentQuery += ', updatedBy';
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
        shipmentQuery += ", "+  this.warehouseID;
        shipmentQuery += ", '"+today+"'" +')';

        let shipmentRecord = new record.Record(shipment.shipmentID,"warehouse"+this.warehouseID,"added",this.userID,today);
        let myShipmentRecord = shipmentRecord.toArray()
        let shipmentRecordQuery = "INSERT into records(";
        for (let i = 0; i < myShipmentRecord[0].length; i++){
            shipmentRecordQuery += myShipmentRecord[0][i];
            if (i< myShipmentRecord[0].length-1)
            shipmentRecordQuery += ", ";
        }
        shipmentRecordQuery += ')values(';
        for (let i = 0; i < myShipmentRecord[1].length; i++){
            if (Number(myShipmentRecord[1][i])>=0 && String(myShipmentRecord[1][i]).length<10)
            shipmentRecordQuery += myShipmentRecord[1][i];
            else
            {   
                shipmentRecordQuery += "'";
                shipmentRecordQuery += myShipmentRecord[1][i];
                shipmentRecordQuery += "'";
            }
            if (i< myShipmentRecord[0].length-1)
                shipmentRecordQuery += ", ";
        }
        console.log(shipmentQuery);
        shipmentRecordQuery += ')';
        //connect to database, add this shipment, add shipment's record, then close the connection.
        connection.connect((err)=> {
            if (err) console.log("there is an error with connecting to database");
            else{
                connection.query(shipmentQuery, (err,result,fields)=>{
                    if (err) console.log("shipment "+shipment.shipmentID+" is failed to be added");
                    else console.log("shipment "+shipment.shipmentID+" is successfully added on "+shipmentRecord.recordedPlace);
                });
                connection.query(shipmentRecordQuery, (err,result,fields)=>{
                    if (err) console.log("shipment "+shipment.shipmentID+" is failed to be recorded");
                    else console.log("shipment "+shipment.shipmentID+" is successfully recorded on "+shipmentRecord.recordedPlace);
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
        consignorQuery += ', addedBy, lastUpdate)values(';
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
        consignorQuery += this.userID + ", '"+today+"'" +')';
        //setUp User query
        console.log(consignorQuery)
        let userQuery = "INSERT into users(userID, firstName, lastName, email, phoneNumber, role, lastUpdate) values(";
        userQuery += consignor.userID+", '"+consignor.firstName + "', '" + consignor.lastName + "', '"+consignor.email+ "', '"+ consignor.phoneNumber  + "', "; 
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
        //create connection
        const connection=conn.startConnection();
        //query setup
        const viewConsignorsQuery = "SELECT * FROM consignors WHERE addedBy = " + this.userID;
        const fileName = 'server/responses/view consignors/warehouseManager' + this.userID + '.json';
        //connect to database
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(viewConsignorsQuery, (err, result,fields) => {
                    if (err) console.log("could not find consignors' list due to some error in the query");
                    else{
                        fs.writeFile(fileName, JSON.stringify(result), (err)=>{
                            if (err) console.log("could not save consignors' list in the JSON file due to some error in file system");
                            else console.log("consignors' list are successfully saved in: " + fileName);
                        });
                    }
                });
            }
            connection.end();
        });
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
            workerQuery += ', lastUpdate)values(';
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
         //create connection
        const connection=conn.startConnection()
        //get current date
        const today = utility.getDateTime();
         //setup query
        let myWorker = worker.toArray();
        let workerQuery = "UPDATE workers SET "
        for (let i = 1; i < myWorker[0].length; i++){
            workerQuery += myWorker[0][i];
            workerQuery += "=";
            if (Number(myWorker[1][i])>=0)
            workerQuery += myWorker[1][i];
            else{
                workerQuery += "'";
                workerQuery += myWorker[1][i];
                workerQuery += "'";
            }
            workerQuery += ", ";
        }
        workerQuery +=  'lastUpdate = ' +"'" + today + "'";
        workerQuery += " Where " + myWorker[0][0] + " = " + myWorker[1][0];

        //  connect to database, update this worker, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(workerQuery,(err, result,fields)=>{
                    if (err) console.log("your worker's details couldn't be updated due to some error in the query");
                    else console.log("your worker's details are up to date!");
                })
            }
            connection.end();
        });
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
        const keys=['firstName','lastName','phoneNumber','email','password','warehouseID'];
        const values=[this.firstName,this.lastName,this.phoneNumber,this.email,this.password,this.warehouseID];
        pair.push(keys);
        pair.push(values);
        return pair;
    }

    modifyWarehouse(warehouse){

    }

    deleteWarehouse(warehouse){

    }

    viewWarehouse(warehouse){

    }

    viewWarehousesList(){

    }

    addShelf(shelf){

    }

    deleteShelf(shelf){

    }

    addWarehouse(warehouse){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup warehouse query
        let myWarehouse = warehouse.toArray();
        let warehouseQuery = "INSERT into warehouses("
        for (let i = 0; i < myWarehouse[0].length; i++){
            warehouseQuery += myWarehouse[0][i];
            if (i< myWarehouse[0].length-1)
            warehouseQuery += ", ";
        }
        warehouseQuery += ', lastUpdate';
        warehouseQuery += ')values(';
        for (let i = 0; i < myWarehouse[1].length; i++){
            if (Number(myWarehouse[1][i])>=0)
            warehouseQuery += myWarehouse[1][i];
            else
            {
                warehouseQuery += "'";
                warehouseQuery += myWarehouse[1][i];
                warehouseQuery += "'";
            }
            warehouseQuery += ", ";
        }
        warehouseQuery += "'"+today+"'" +')'

        //connect to database, add this warehouse, then close the connection.
        connection.connect((err) => {
            if (err) console.error("there is an error with connecting to database");
            else {
                connection.query(warehouseQuery, (err, result,fields) => {
                    if (err) console.log("could not insert warehouse due to some error in the query");
                    else console.log("your warehouse is successfully added");  
                });
            } 
            connection.end();
        })
    }
}

module.exports = {
    warehouseManager,
}