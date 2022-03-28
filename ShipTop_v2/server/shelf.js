class Shelf{
    constructor(shelfNumber,row, section, lane, floor, isReserved, warehouseID, shipmentID) {
        this.shelfNumber = shelfNumber;
        this.row = row;
        this.section = section;
        this.lane = lane;
        this.floor = floor;
        this.isReserved = isReserved;
        this.warehouseID = warehouseID;
        this.shipmentID = shipmentID;
    }
    toArray(){
        const pair = [];
        const keys=['shelfNumber', 'row', 'section', 'lane', 'floor', 'isReserved', 'warehouseID', 'shipmentID'];
        const values=[this.shelfNumber,this.row, this.section, this.lane, this.floor,this.isReserved, this.warehouseID, this.shipmentID];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    Shelf,
}