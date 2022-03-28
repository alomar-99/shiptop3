const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');

const transprotationMember = require('./tranportationMember');

class Dispatcher extends tranportationMember.tranportationMember{
    constructor(dispatcherID, firstName, lastName, email, phoneNumber, password){
        super(dispatcherID, firstName, lastName, email, phoneNumber,password);
    }

    assignVehicleToDriver(vehicle,driver){

    let driverSQL = "UPDATE drivers SET vehicleID ="+vehicle.id+"WHERE driverID =" +driver.driverID;
    let vehicleSQL = "UPDATE vehicle SET assignedDriver ="+driver.id+"WHERE vehicleID =" +vehicle.id;
    



    }
    adddriver(driver,userID){
        //create connection
        const connection=conn.startConnection();
        //getDate
        const today = utility.getDateTime();
        //setup query
        let mydriver = driver.toArray();
        let driverQuery = "INSERT into drivers(";
        for (let i = 0; i < mydriver[0].length; i++){
            driverQuery += mydriver[0][i];
            if (i< mydriver[0].length-1)
            driverQuery += ", ";
        }
        driverQuery += ', lastUpdate';
        driverQuery += ')values(';
        for (let i = 0; i < mydriver[1].length; i++){
            if (Number(mydriver[1][i])>=0 && String(mydriver[1][i]).length<10)
            driverQuery += mydriver[1][i];
            else
            {
                driverQuery += "'";
                driverQuery += mydriver[1][i];
                driverQuery += "'";
            }
            driverQuery += ", ";
        }
        driverQuery += "'"+today+"'" +')';
        //setUp User query
        let userQuery = "INSERT into users(userID, firstName, lastName, email, phoneNumber, role, roleID, lastUpdate) values(";
        userQuery += userID+", '"+driver.firstName + "', '" + driver.lastName + "', '"+driver.email+ "', '"+ driver.phoneNumber  + "', "; 
        userQuery += "'warehouseWorker'" + ', '+ driver.driverID +", '"+today+"'" +')';
        //connect to database, add this worker, then close the connection.
        connection.connect((err)=> {
            if (err) console.error("there is an error with connecting to database");
            else{
                connection.query(driverQuery, (err,result,fields)=>{
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

   

    addVehicle(vehicle){
        const today = utility.getDateTime();
        const connection=conn.startConnection();
        let sql = "INSERT into vehicle(`VehicleID`,`VehicleName`,`ManufacturerCompany`,`Status`,`address`,`assignedDriver`,`dispatcherID`,`lastUpdate`)"; 
       +" values ("+vehicle.vehicleID+","+vehicle.vehicleName+","+vehicle.ManufacturerCompany+","+vehicle.Status+","+vehicle.assignedDriver+","+vehicle.dispatcherID+","+today+") ";
    }

    viewListofVehicles(){

    }

   

    viewListofDrivers(){

    }

    viewVehicleInformation(vehicle){

    }

    RemoveVehicle(vehicle){
        const connection=conn.startConnection();
        let sql = "DELETE  from vehicles where vehicleID= "+vehicle.vehicleID + " ";

        connection.end();
    }

    RemoveDriver(driver){
        const connection=conn.startConnection();
        let sql = "DELETE  from drivers where driverID= "+driver.driverID + "";
        
        connection.end();

    }

    viewDriverDetails(driver){

    }
    changeVehicleStatus(vehicle){
        let driverSQL = "UPDATE drivers SET status ="+vehicle.status+"WHERE driverID =" +vehicle.vehicleID; 
    }

}

module.exports = {
    Dispatcher,
}