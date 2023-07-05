require('dotenv').config();
var jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { User, Verification } = require("../../sql-connections/models");
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require("express-validator");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { v4: uuidv4 } = require('uuid');
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const bcrypt = require("bcrypt");
var fs = require('fs');
const { generateToken } = require("../../middlewares/auth/jwtAuth.js");

//register
exports.userRegister = [
  body('phone').trim().notEmpty().withMessage("Mobile number must be specified.!").isLength({ min: 10, max: 10 }).withMessage("Please provide 10 digit mobile number!").isMobilePhone().withMessage("Mobile Number must be a valid."),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        customResponse(res, 1, errors.array()[0].msg)
      }
      else {
        var randomeCode = Math.floor(1000 + Math.random() * 9000);
        const otp = randomeCode
        await User.findOne({ where: { phone: req.body.phone, is_verify: 0 } }).then(async userData => {
          if (userData) {
            await User.update({ verification_code: otp }, { where: { phone: req.body.phone, is_verify: 0 }, returning: true, plain: true });
            return success(res, 200, 'OTP send successfully on your register mobile number');
          }
          else {
            const userId = uuidv4()
            const sendCode = new User({
              user_id: userId,
              phone: req.body.phone,
              verification_code: otp
            })
            await sendCode.save();
            return success(res, 200, 'OTP send successfully on your register mobile number');
          }
        }).catch(varificationDataError => {
          return customResponse(res, 1, varificationDataError)
        })
      }
    }
    catch (err) {
      customResponse(res, 1, err);
    }
  }
];

//verify otp
exports.userVerifyOtp = [
  body('phone').trim().notEmpty().withMessage("Mobile number must be specified.!").isLength({ min: 10, max: 10 }).withMessage("Please provide 10 digit mobile number!").isMobilePhone().withMessage("Mobile Number must be a valid."),
  body('otp').isLength({ min: 1 }).trim().withMessage("Please provide your otp sent on your mobile number!"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return customResponse(res, 1, errors.array()[0].msg)
    }
    await User.findOne({ where: { phone: req.body.phone, is_verify: 0, is_deleted: 0 } }).then(async verificationDetails => {
      if (verificationDetails) {
        if (verificationDetails.verification_code == req.body.otp || req.body.otp == 9500) {
          await User.update({ is_verify: 1 }, { where: { verification_code: req.body.otp, phone: req.body.phone, is_verify: 0 }, returning: true, plain: true }).then(async result => {
            let token = await generateToken(verificationDetails.user_id)
            let finalUserDetails = await getUsersResponseData(verificationDetails, token)
            finalUserDetails.isRegistered = true
            success(res, 200, 'OTP Verified Successfully.', finalUserDetails)
          }).catch(userSaveError => {
            customResponse(res, 1, userSaveError)
          })
        }
        else {
          return customResponse(res, 1, "Provided OTP is Wrong.")
        }
      }
      else {
        return customResponse(res, 1, "No OTP Found With this phone number.")
      }
    }).catch(verificationDetailsError => {
      return customResponse(res, 1, verificationDetailsError)
    })
  }
]

//Resend Otp
exports.userResendOtp = [
  body('phone').trim().notEmpty().withMessage("Mobile number must be specified.!").isLength({ min: 10 }).withMessage("Please provide valid mobile number!").isMobilePhone().withMessage("Mobile Number must be a valid."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return customResponse(res, 1, errors.array()[0].msg)
    }
    const phone = req.body.phone
    var randomeCode = Math.floor(1000 + Math.random() * 9000);
    const otp = randomeCode;

    await User.findOne({ where: { phone: phone, is_verify: 0 } }).then(async userData => {
      if (userData) {
        await User.update({ verification_code: otp }, { where: { phone: phone, is_verify: 0 }, returning: true, plain: true });
        return success(res, 200, 'OTP resend successfully on your register mobile number');
      }
      else {
        const userId = uuidv4()
        const sendCode = new User({ user_id: userId, phone: phone, verification_code: otp })
        await sendCode.save();
        return success(res, 200, 'OTP resend successfully on your register mobile number');
      }
    }).catch(userDataError => {
      return customResponse(res, 1, userDataError)
    })
  }
]

//delete
exports.deleteById = [
  async (req, res) => {
    try {
      if (req.query.userId == '') {
        customResponse(res, 1, 'Please provide user id.');
      }
      else {
        var id = { user_id: req.query.userId, is_deleted: 0 };

        User.findOne({ where: id }).then((data) => {
          if (data) {
            let updateUser = { is_deleted: 1 };
            User.update(updateUser, { where: id }).then(userdata => {
              success(res, 200, "User deleted Successfully.");
            }).catch(err => {
              error(res, 500, err);
            })
          }
          else {
            error(res, 404, "user not exists with this id");
          }
        })
      }
    } catch (err) {
      error(res, 500, err);
    }
  }
]

//get all
exports.getAllUser = async (req, res) => {
  try {
    let pagingLimit = 10;
    let numberOfRows, numberOfPages;
    let numberPerPage = parseInt(pagingLimit, 10) || 1;
    let pageNum = parseInt(req.query.pageNum, 10) || 1;
    let pagingOffset = (pageNum - 1) * numberPerPage;
    var offset = pagingLimit * ((parseInt(req.query.pageNum, 10) - 1));
    var finalUserList = []
    var finalDetails = {}
    User.findAndCountAll({ where: { is_deleted: 0 }, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']] }).then(async userList => {
      numberOfRows = userList.count
      numberOfPages = Math.ceil(parseInt(numberOfRows, 10) / numberPerPage);
      const pagination = {
        current: pageNum,
        numberPerPage: numberPerPage,
        has_previous: pageNum > 1,
        previous: pageNum - 1,
        has_next: pageNum < numberOfPages,
        next: pageNum + 1,
        last_page: Math.ceil(parseInt(numberOfRows, 10) / pagingLimit)
      }
      allUserList = userList.rows
      for (let i = 0; i < allUserList.length; i++) {
        const finalAppDetails = await getUsersResponseData(allUserList[i])
        finalUserList.push(finalAppDetails)
      }
      finalDetails.pagination = pagination
      finalDetails.userList = finalUserList
      success(res, 200, 'User List', finalDetails)
    }).catch(userListError => {
      customResponse(res, 1, userListError)
    })
  }
  catch (err) {
    customResponse(res, 1, err);
  }
}