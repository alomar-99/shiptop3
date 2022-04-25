

app.post("/api/logisticManager/addWarehouseManager",urlEncodedParser, (req, res) => {
    const errSQL = "SELECT * FROM employee WHERE email ='" +req.body.email +"'";
    connection.query(errSQL, (err, result)=>{
        if (err) throw err;
        if (result!="")    
            res.send({
                "status": "EXISTING ACC", 
                "err": true
            });
    
        else{
            const employeeSQL = "INSERT INTO employee(firstName, lastName, role, email, phoneNumber, password)"+ "VALUES('"+ req.body.firstName +"', '" + req.body.lastName + "', 'WO', '" + req.body.email + "', '" + req.body.phoneNumber + "', '" + req.body.password +"') ";
            const officeSQL = "INSERT INTO office (employeeID, location, telephone) VALUES(" + "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ,'" + req.body.office.location + "', '" + req.body.office.telephone + "')";
            const updateSQL = "INSERT INTO employeeupdate (employeeID, updatedBy, lastUpdate) VALUES( "+ "(SELECT employeeID FROM employee WHERE email = '"+req.body.email+"') ," + req.body.employeeID + ", '" + time.getDateTime() + "')";
            connection.query(employeeSQL, (err)=>{
            if (err) throw err;
            });
            connection.query(officeSQL, (err)=>{
                if (err) throw err;
            });
            connection.query(updateSQL, (err)=>{
                if (err) throw err;
                res.send({
                    "status": "SUCCESS", 
                    "err": false
                });
            });
        }
    });
});