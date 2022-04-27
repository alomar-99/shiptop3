//general imports
const express = require("express");

//initializing express
const app = express();
const port = process.env.PORT || 3000;

//users imports
const LM = require("./routes/logisticManager");
const WM = require("./routes/warehouseManager")
const US = require("./routes/user");
const AD = require("./routes/administrator");
const CO = require("./routes/consignor");
const FB = require("./routes/freightBroker");
const DI = require("./routes/dispatcher");
const DR = require("./routes/driver");
const OW = require("./routes/owner");
const AC = require("./routes/accountant");
const CS = require("./routes/customerService");

//
//accepting json files
app.use(express.json());

//routing all users to their files
app.use("/api/logisticManager",LM);
app.use("/api/warehouseManager",WM);
app.use("/api/user",US);
app.use("/api/administrator",AD);
app.use("/api/consignor",CO);
app.use("/api/freightBroker",FB);
app.use("/api/dispatcher",DI);
app.use("/api/driver",DR);
app.use("/api/owner",OW);
app.use("/api/accountant",AC);
app.use("/api/customerService",CS);



//listening
app.listen(port, () => console.log("server started on port " + port + " !"));

