//general imports
const express = require("express");

//initializing express
const app = express();
const port = process.env.PORT || 3000;

//users imports
const LM = require("./routes/logisticManager");
const WM = require("./routes/warehouseManager")
const EM = require("./routes/employee");

//accepting json files
app.use(express.json());

//routing all employees to their files
app.use("/api/logisticManager",LM);
app.use("/api/warehouseManager",WM);
app.use("/api/employee",EM);

//listening
app.listen(port, () => console.log("listening to port " + port + " ..."));

