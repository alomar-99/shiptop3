const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const saltRounds = 10;
const initModels = require('../models');
const sequelize = require('../util/database')



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

module.exports ={
    getUser, postUser,
}