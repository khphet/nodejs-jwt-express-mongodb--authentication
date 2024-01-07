const db = require("../models");
const email_validator = require('email-validator');
const password_validator = require('password-validator');
const username_isvalid = require('validator');

const ROLES = db.ROLES;
const User = db.user;


// Check Username Format
checkUsernameValidate = (req, res, next) => {
  const username_in = req.body.username;

  if(!username_in){
    res.status(400).send({message: "Username is required!"});
    return;   
  }

  const result = username_isvalid.matches(username_in, "^[a-zA-Z0-9_\.\-]*$");
  if(!result){
    res.status(400).send({message: "Username is not valid!"});
    return;
  }
  next();
};

// Check Password Validate
checkPasswordValidate = (req, res, next) => {
  var scheme = new password_validator();
  scheme
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits  
  .has().symbols(1)                               // Must have sprecial character at least 1 
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

  const password_in = req.body.password;
  if(!password_in){
    res.status(400).send({message: "Password is required!"});
    return;
  }
  const isvalid = scheme.validate(password_in);
  if(!isvalid){
    res.status(400).send({message: "Password is not valid! Please check password length more >= 8, have uppercase letters, have lowercase letters, have at least 2 digits,have sprecial character at least 1  and not have space"});
    return;
  }
  next();
};


// Check confirm password
checkPasswordCompareConfirm = (req, res, next) => {

  const password_in = req.body.password;
  const password_con = req.body.passwordconfirm;

  if(password_in != password_con){
    res.status(400).send({message: "Password is not valid! Please check Confirm Password must be same!"}); 
    return;
  }
  next();

};



// Cjeck Email Validate
checkEmailValidate = (req, res, next) => {
  const email_in = req.body.email;
  if(!email_in){
    res.status(400).send({ message: "Email is required!" });
    return;
  }

  const isvalid = email_validator.validate(email_in);
  if(!isvalid){
    res.status(400).send({message: "Email is not valid!"});
    return;
  }
  next();
};


// Check DuplicateUsernameOrEmail
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

// Check Roles
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkPasswordCompareConfirm,
  checkUsernameValidate,
  checkPasswordValidate,
  checkEmailValidate,
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
