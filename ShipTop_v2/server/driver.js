const conn = require('./accessibility/connection');
const utility = require('./accessibility/utility');

const transprotationMember = require('./tranportationMember');

class Driver  extends tranportationMember.tranportationMember{
    constructor(driverID, firstName, lastName, email, phoneNumber, password){
        super(firstName, lastName, email, phoneNumber,password);
        this.driverID = driverID;
    }



    viewAssignedVehicle(driver){

    }
    






    
}