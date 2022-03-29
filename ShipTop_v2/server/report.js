class Report{
    constructor(ReportID, EMail, subject, content, custumerServiceID,lastUpdate){
        this.ReportID = ReportID;
        this.subject = subject;
        this.EMail = EMail;
        this.content = content;
        this.custumerServiceID = custumerServiceID;
        this.lastUpdate = lastUpdate;
    }
    toArray() {
        const pair = [];
        const keys = ['ReportID', 'EMail', 'subject', 'content', 'custumerServiceID','lastUpdate'];
        const values = [this.ReportID, this.EMail, this.subject, this.content, this.custumerServiceID, this.lastUpdate];
        pair.push(keys);
        pair.push(values);
        return pair;
    }
}

module.exports ={
    Report,
} 