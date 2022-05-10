//general imports
const express = require("express");


//initializing express
const app = express();
const port = process.env.PORT || 5001;
const http = require("http").Server(app);
var cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
    origin: "*", 
    methods: ["GET", "POST"]
    } 
})

//using cors
app.use(cors())

//users imports
const LM = require("./routes/logisticManager");
const WM = require("./routes/warehouseManager"); 
const US = require("./routes/user");
const AD = require("./routes/administrator");
const CO = require("./routes/consignor");
const FB = require("./routes/freightBroker");
const DI = require("./routes/dispatcher");
const DR = require("./routes/driver"); 
const OW = require("./routes/owner");
const AC = require("./routes/accountant");
const CS = require("./routes/customerService");
const WO = require("./routes/worker");

//accepting json files
app.use(express.json());


app.use("/api/user",US);



// //authenticate user
// app.use((req,res,next)=>{

//     const token = req.headers.authorization.split(" ")[1];
//     if(req.headers.authorization == ""){
//         res.send({
//             "AUTHORIZATION":"NO TOKEN",
//             "err": true
//         });
//     } 
//     else if(req.headers.authorization != token){
//         res.send({
//             "AUTHORIZATION":"UNAUTHORIZED",
//             "err": true
//         });
//     }
//     else next();
// });

//routing all users to their files
app.use("/api/logisticManager",LM);
app.use("/api/warehouseManager",WM);

app.use("/api/administrator",AD);
app.use("/api/consignor",CO);
app.use("/api/freightBroker",FB);
app.use("/api/dispatcher",DI);
app.use("/api/driver",DR);
app.use("/api/owner",OW);
app.use("/api/accountant",AC);
app.use("/api/customerService",CS);
app.use("/api/worker",WO);

//axios 
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "POST, GET"); 
});

//listening
app.listen(port, () => console.log("server started on port " + port + " !"));

