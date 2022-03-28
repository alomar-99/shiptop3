const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');
const employee = require('./employee');

class Dispatcher extends employee.Employee{
    constructor(dispatcherID, firstName, lastName, email, phoneNumber, password){
        super(firstName, lastName, email, phoneNumber,password);
        this.dispatcherID = dispatcherID;
    }

    assignVehicleToDriver(vehicle,driver){

    }

    addDriver(driver){

    }

    addVehicle(vehicle){

    }

    viewListofVehicles(){

    }

    viewShipmentDetails(shipment){

    }

    viewListofDrivers(){

    }

    viewVehicleInformation(vehicle){

    }

    RemoveVehicle(vehicle){

    }

    RemoveDriver(driver){

    }

    viewDriverDetails(driver){

    }

}

module.exports = {
    Dispatcher,
}