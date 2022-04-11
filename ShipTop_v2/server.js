//imports
const express = require('express');
const employeeRoute = require('./routes/employee');

//initializing express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/employees",employeeRoute);

//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));
