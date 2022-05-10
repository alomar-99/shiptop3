//general imports
const express = require("express");
const jwt = require("jsonwebtoken");



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

app.use("/api/user",US);

//accepting json files
app.use(express.json());



exports.getUser =
  // (authUser,
  (req, res, next) => {
    const { username, password } = req.body.payload;
    // let history = useHistory();
    const models = initModels(sequelize);
    models.users.findOne({
      where: {
        username: username,
      },
    })
      .then((result) => {
        if (!result) {
          console.log("Not registered");
        } else {
          bcrypt.compare(password, result.password, (err, response) => {
            if (response) {
              // req.session.user = result;
              // console.log(req.session.user);
              // const id = result.id;
              // const token = jwt.sign({ id }, "jwtSecret", {
              //   expiresIn: 1200,
              // });
              // req.session.user = result;

              // res.json({ auth: true, token: token, result: result});
              console.log("we found the user");
              console.log(result.username);
              const token = jwt.sign({ username: result.username }, config.get("jwtSecret"), { expiresIn: 36000 });
              console.log(token);
              if (!token) throw Error("Couldnt sign the token");
              res.status(200).json({
                success: true,
                token,
                user: {
                  username: result.username,
                },
              })
            } else {
              res.status(200).json({
                success: false,
                message: "wrong password"
              })
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

exports.postUser = async (req, res, next) => {
  const { username, email, password } = req.body.payload;
  if(password){
  var hashedPass = await bcrypt.hash(password, saltRounds);
  const models = initModels(sequelize);
  var user = await models.users.findOne({
    where: {
      username: username,
    }
  }); 
  var user1 = await models.users.findOne({
    where: {
      email: email
    }
  });
  if(user || user1) {
    return res.send({
      success: false,
      message: "Email or Username is already existed!"
    });
  } 

  const newuser = models.users.build({
    username: username,
    email: email,
    password: hashedPass,
  });
  newuser
    .save()
    .then((result) => {
      jwt.sign(
        { username: result.username },
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;

          res.send({
            success: true,
            token,
            result: {
              username: username,
              email: email,
            }
          });
          console.log(token);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
}
console.log("no password");
}

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

