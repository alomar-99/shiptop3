const user = require('./user')

class Consignee extends user.User {
    constructor(consigneeID,firstName,lastName,email,phoneNumber){
        super(consigneeID,firstName,lastName,email,phoneNumber);
    }
    toArray(){ 
        const pair = []
        const keys=['consigneeID','firstName','lastName','email','phoneNumber'];
        const values=[this.consigneeID,this.firstName,this.lastName,this.email,this.phoneNumber];
        pair.push(keys)
        pair.push(values)
        return pair;
    }
}

module.exports = {
    Consignee,
}