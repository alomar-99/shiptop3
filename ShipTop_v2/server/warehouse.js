class Warehouse{
    constructor(warehouseID,name,location,city,telephone,referenceNumber,managerID,userID,workers,shelfs){
        this.warehouseID = warehouseID;
        this.name = name;
        this.location = location;
        this.city = city;
        this.telephone = telephone;
        this.referenceNumber = referenceNumber;
        this.managerID = managerID;
        this.userID = userID;
        this.workers = workers;
        this.shelfs = shelfs;
    }
    toArray() {
        const pair = []
        const keys=['warehouseID','name','location','city','telephone','referenceNumber','managerID','logisticManagerID']
        const values=[this.warehouseID,this.name,this.location,this.city,this.telephone,this.referenceNumber,this.managerID,this.userID]
        pair.push(keys)
        pair.push(values)
        return pair;
    }
}

module.exports = {
    Warehouse,
}