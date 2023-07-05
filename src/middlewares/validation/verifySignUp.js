const { User } = require("../../sql-connections/models");
const { customResponse } = require("../../helpers/response/api-response.js");

checkDuplicateEmailOrPhone = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.email,
      is_deleted : 0
    }
  }).then(user => {
    if (user) {
      customResponse(res,1,"Failed! Email is already in use!")
      return;
    }

    // Phone
    User.findOne({
      where: {
        phone: req.body.phone,
        is_deleted : 0
      }
    }).then(user => {
      if (user) {
        customResponse(res,1,"Failed! Phone Number is already in use!")
        return;
      }
      next();
    });
  });
};

checkDuplicatePhone = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      phone: req.body.phone,
      is_deleted : 0
    }
  }).then(user => {
    if (user) {
      customResponse(res,1,"Failed! Phone is already in use!")
      return;
    }
    next();
  });
};


const verifySignUp = {
  checkDuplicateEmailOrPhone: checkDuplicateEmailOrPhone,
  checkDuplicatePhone : checkDuplicatePhone
};

module.exports = verifySignUp;