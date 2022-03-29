class Warehouse{
    constructor(warehouseID,name,location,city,telephone,referenceNumber,managerID){
        this.warehouseID = warehouseID;
        this.name = name;
        this.location = location;
        this.city = city;
        this.telephone = telephone;
        this.referenceNumber = referenceNumber;
        this.managerID = managerID;
    }
    toArray() {
        const pair = []
        const keys=['warehouseID','name','location','city','telephone','referenceNumber','managerID'];
        const values=[this.warehouseID,this.name,this.location,this.city,this.telephone,this.referenceNumber,this.managerID];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    Warehouse,
}