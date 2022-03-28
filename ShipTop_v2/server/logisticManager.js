const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const employee = require('./employee');

class logisticManager extends employee.Employee{
    constructor(logisticManagerID, firstName, lastName,email, phoneNumber, password){
        super(logisticManagerID, firstName,lastName,email,phoneNumber,password);
    }
    addWarehouseManager(warehouseManager){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let myWarehouseManager = warehouseManager.toArray();
        let warehouseManagerQuery = "INSERT into warehousemanagers("
        for (let i = 0; i < myWarehouseManager[0].length; i++){
            warehouseManagerQuery += myWarehouseManager[0][i];
            if (i< myWarehouseManager[0].length-1)
            warehouseManagerQuery += ", ";
        }
        warehouseManagerQuery += ', lastUpdate';
        warehouseManagerQuery += ')values(';
        for (let i = 0; i < myWarehouseManager[1].length; i++){
            if (Number(myWarehouseManager[1][i])>=0 && String(myWarehouseManager[1][i]).length<10)
            warehouseManagerQuery += myWarehouseManager[1][i];
            else
            {
                warehouseManagerQuery += "'";
                warehouseManagerQuery += myWarehouseManager[1][i];
                warehouseManagerQuery += "'";
            }
            warehouseManagerQuery += ", ";
        }
        warehouseManagerQuery += "'"+today+"'" +')';
        // connect to database, add this warehouse manager, then close the connection.
        connection.connect((err)=>{
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(warehouseManagerQuery, (err,result,fields)=>{
                    if (err) console.log("your warehouse manager is failed to be added");
                    else console.log("your warehouse manager is successfully added");
                });
            }
            connection.end();
        })

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

    setUpShelfQuery(shelf){
        let myShelf = shelf.toArray();
        let shelfQuery = "INSERT into shelfs("
        for (let i = 0; i < myShelf[0].length; i++){
            shelfQuery += myShelf[0][i];
            if (i< myShelf[0].length-1)
            shelfQuery += ", ";
        }
        shelfQuery += ')values(';
        for (let i = 0; i < myShelf[1].length; i++){
            if (Number(myShelf[1][i])>=0)
            shelfQuery += myShelf[1][i];
            else
            {
                shelfQuery += "'";
                shelfQuery += myShelf[1][i];
                shelfQuery += "'";
            }
            shelfQuery += ", ";
        }
        return shelfQuery;
    }



}

module.exports = {
    logisticManager,
}