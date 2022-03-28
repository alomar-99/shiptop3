class Shipment{
    constructor(shipmentID,destinationNumber,weight,description,length,width,height,isBreakable,status,telephone,department,address,sender,departureCity,arrivalCity,arrivalDate,deliveryDate){
        this.shipmentID = shipmentID;
        this.destenation = destinationNumber;
        this.weight = weight;
        this.description = description;
        this.length = length;
        this.width = width;
        this.height = height;
        this.isBreakable = isBreakable;
        this.status = status;
        this.telephone = telephone;
        this.department = department;
        this.address = address;
        this.sender = sender;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.arrivalDate = arrivalDate;
        this.deliveryDate = deliveryDate;
    }
    toArray() {
        const pair = [];
        const keys=['shipmentID','destinationNumber','weight','description','length','width','height','isBreakable','status','telephone','department','address','sender','departureCity','arrivalCity','arrivalDate','deliveryDate']
        const values=[this.shipmentID,this.destenation,this.weight,this.description,this.length,this.width,this.height,this.isBreakable,this.status,this.telephone,this.department,this.address,this.sender,this.departureCity,this.arrivalCity,this.arrivalDate,this.deliveryDate];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports = {
    Shipment,
}