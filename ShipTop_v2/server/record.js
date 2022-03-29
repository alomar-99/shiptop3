class Record{
    constructor(shipmentID, recordedPlace, action, updatedBy, lastUpdate){
        this.shipmentID = shipmentID;
        this.recordedPlace = recordedPlace;
        this.action = action;
        this.updatedBy = updatedBy;
        this.lastUpdate = lastUpdate;
    }

    toArray(){
        const pair = [];
        const keys=['shipmentID', 'recordedPlace', 'action', 'updatedBy', 'lastUpdate'];
        const values=[this.shipmentID, this.recordedPlace, this.action, this.updatedBy, this.lastUpdate];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    Record,
}