const config = require("../config/auth.config");
const TokenConfig = require("../config/token.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    createat: new Date(),
    lastlogin: new Date(),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
        });
      });
    }

    res.status(200).send({ message: "User was registered successfully!",
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               username: user.username,
               password: user.password,
               createat: user.createat});

  });
};



exports.signin = (req, res) => {

  // Check input Username & Password
  const username_in = req.body.username;
  const password_in = req.body.password;
  if(!username_in){
    res.status(400).send({message: "Username is required!"});
    return;
  }
  if(!password_in){
    res.status(400).send({message: "Password is required!"});
    return;
  }

  // Check User
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      //Save User last login
      user.lastlogin = new Date();
      user.save((err) =>{
        if(err){
          res.send({message: err});
          return;
        }
      })


      // Set token expire
      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: TokenConfig.TokenExpire,
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        message: "User login successfully!",
        token: token,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: authorities,
        lastlogin: user.lastlogin,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!",
                                  session: req.session });
  } catch (err) {
    this.next(err);
  }
};
