const jwt = require('jsonwebtoken')
const config = process.env;
require("dotenv").config();
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { Transporters, OTPVerification, ContactNumbers, Managers } = require("../../sql-connections/models");

const generateToken = async (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME })
  await User.update({ access_token: token }, { where: { user_id: userId,is_deleted:0 }, returning: true, plain: true }).then(async tokenUpdate => {
    await User.findOne({ where: { user_id: userId,is_deleted:0 } }).then(async userDetails => {
      // return userDetails.access_token
    }).catch(getTokenDetailsError => {
      console.log(getTokenDetailsError)
    }) 
  }).catch(tokenSaveError => {
    console.log(tokenSaveError)
  })
};

const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    error(res,401,"Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    error(res,401,"Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    userId = decoded._id;
    await User.findOne({ where: { user_id: userId,is_deleted:0 } }).then(async userDetails => {
      if(!userDetails)
      {
        error(res,401,"Unauthorized Access.");
      }
      next();
    }).catch(getTokenDetailsError => {
      error(res, 401, getTokenDetailsError)
    }) 
  } catch (err) {
    res.status(401).send("Invalid authorization token.");
  }
};

const generateClientToken = async (clientId) => {
  const token = jwt.sign({ _id: clientId }, process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME })
  await Client.update({ access_token: token }, { where: { client_id: clientId,is_deleted:0 }, returning: true, plain: true }).then(async tokenUpdate => {
    await Client.findOne({ where: { client_id: userId,is_deleted:0 } }).then(async clientDetails => {
      // return clientDetails.access_token
    }).catch(getTokenDetailsError => {
      console.log(getTokenDetailsError)
    })  
  }).catch(tokenSaveError => {
    console.log(tokenSaveError)
  })
};

const verifyClientToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    error(res,401,"Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    error(res,401,"Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    userId = decoded._id;
    await Client.findOne({ where: { client_id: userId,is_deleted:0 } }).then(async clientDetails => {
      if(!clientDetails)
      {
        error(res,401,"Unauthorized Access.");
      }
      next();
    }).catch(getTokenDetailsError => {
      error(res, 401, getTokenDetailsError)
    }) 
  } catch (err) {
    res.status(401).send("Invalid authorization token.");
  }
};
module.exports = {generateToken, verifyToken, generateClientToken, verifyClientToken};
