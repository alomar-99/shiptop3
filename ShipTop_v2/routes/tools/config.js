//imports
const mysql = require('mysql');
const bodyParser = require('body-parser');

// middleware handler
const middleware = bodyParser.urlencoded({ extended: false })



//connection details
const connectionInfo = {
    connectionLimit : 1,
    host: 'shiptop.cutl0z5usu28.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'BX7i-tZ!j=TM6XH',
    database: 'shiptop',
    multipleStatements: true
};

//connection creation link to database
const dbConnection = mysql.createConnection(connectionInfo);

//start connecting to database using the previous link
dbConnection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    } 
    console.log("database connected successfully");
});

//create pool
const connection = mysql.createPool(connectionInfo);

// Attempt to catch disconnects 
connection.on('connection',  (conn) => {
    console.log('DB Connection established');
    conn.on('error',  (err) => {
        console.error(new Date(), 'MySQL error', err.code);
    });
    conn.on('close', (err) => {
        console.error(new Date(), 'MySQL close', err);
    });
});



getUser =
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

postUser = async (req, res, next) => {
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

//exports
module.exports = {
    connection,middleware,postUser,getUser
} 