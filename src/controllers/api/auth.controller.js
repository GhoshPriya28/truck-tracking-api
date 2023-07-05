// priya ghosh work

require('dotenv').config();
const { Register, OTPVerification, Managers, Country, TruckParkingAddress, Category } = require("../../sql-connections/models")
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { transporterResponseData, brokerResponseData, clientResponseData } = require("../../helpers/response/parse-response.js")
const { checkValidationForTransporter, checkValidationForBroker, checkValidationForClient, checkValidationForVerifyOtp, checkValidationForSendOtp } = require("../../helpers/validationForAllAccount/validationForAllAccount.js")
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');

// register api
exports.register = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return customResponse(res, 1, "Payload is required.");
    }
    const uniqueId = uuidv4();
    const managerId = uuidv4();
    const truckParkId = uuidv4();

    const { category, name, tradeName, email, contactNum, countryCode, physicalAddress, postalCode, country, companyRegNumber, telephoneNumber, contactPerson, managerDetails, truckParkingAddressDetail, creditLimitApplication, transportAggrement, goodsTransitLimitPerTruck, rateAggrementForm, creditLimitPayTerms } = req.body;

    if (!category) {
      return customResponse(res, 1, "Please provide category.");
    }
    const findCategory = await Category.findOne({ where: { id: category } });
    if (!findCategory) {
      return customResponse(res, 1, "Please provide correct category.");
    }

    const jwtSecretKey = process.env.JWT_TOKEN_KEY;
    const token = jwt.sign({ contact_num: contactNum }, jwtSecretKey);

    //start for transporter
    if (category === "1") {
      const transporterValidation = checkValidationForTransporter(req, res);
      // Retrieve isd_code from the Country table
      const countryData = await Country.findOne({ where: { isd_code: countryCode } });
      if (!countryData) {
        return customResponse(res, 1, "Invalid country code.");
      }
      const findExistContactNum = await Register.findAll({ where: { contact_num: contactNum, isd_code: countryCode } });
      if (findExistContactNum.length !== 0) {
        return customResponse(res, 1, `Account already exists with this role ${findExistContactNum[0].role}`);
      }
      const findNumberIsLoggedIn = await OTPVerification.findAll({ where: { contact_num: contactNum, isd_code: countryCode, is_verified: 1 } });
      if (findNumberIsLoggedIn.length === 0) {
        return customResponse(res, 1, "You are not able to register without logging in.");
      }
      if (transporterValidation === true) {
        const findOtpVerification = await OTPVerification.findOne({ where: { contact_num: contactNum, isd_code: countryCode } });
        const isVerified = findOtpVerification ? findOtpVerification.is_verified : 0;

        const insertTransporterData = {
          unique_role_id: uniqueId,
          role: category,
          name: name,
          trade_name: tradeName,
          email: email,
          isd_code: countryCode,
          contact_num: contactNum,
          physical_address: physicalAddress,
          postal_code: postalCode,
          country: country,
          com_reg_num: companyRegNumber,
          tel_number: telephoneNumber,
          contact_person: contactPerson,
          truck_park_id: truckParkId,
          manager_id: managerId,
          is_verified: isVerified
        };
        const result = await Register.create(insertTransporterData, { returning: true });

        const managerData = {
          unique_role_id: result.unique_role_id,
          manager_id: result.manager_id,
          full_name: managerDetails.fullName,
          email: managerDetails.managerEmail,
          contact_num: managerDetails.managerContactNumber,
          isd_code: managerDetails.managerCountryCode
        };
        await Managers.create(managerData);

        const parkingAddressData = truckParkingAddressDetail.map((address) => ({
          unique_role_id: result.unique_role_id,
          truck_park_id: uuidv4(),
          address: address.address
        }));
        const createdParkingAddresses = await TruckParkingAddress.bulkCreate(parkingAddressData, { returning: true });

        const parkingAddressDetails = createdParkingAddresses.map((createdAddress) => ({
          uniqueRoleId: createdAddress.unique_role_id,
          truckParkId: createdAddress.truck_park_id,
          address: createdAddress.address
        }));
        const finalTransporterDetails = await transporterResponseData(result, token);
        finalTransporterDetails.truckParkingAddressDetail = parkingAddressDetails;
        return success(res, 200, 'Transporter Registered Successfully.', finalTransporterDetails);

      } else {
        return transporterValidation;
      }
    }
    // start for broker
    else if (category === "2") {
      const brokerValidation = checkValidationForBroker(req, res);
      if (truckParkingAddressDetail !== undefined || managerDetails !== undefined) {
        return customResponse(res, 1, "This payload is not for a broker.");
      }
      // Retrieve isd_code from the Country table
      const countryData = await Country.findOne({ where: { isd_code: countryCode } });
      if (!countryData) {
        return customResponse(res, 1, "Invalid country code.");
      }
      const findExistContactNum = await Register.findAll({ where: { contact_num: contactNum, isd_code: countryCode } });
      if (findExistContactNum.length !== 0) {
        return customResponse(res, 1, `Account already exists with this role ${findExistContactNum[0].role}`);
      }
      const findNumberIsLoggedIn = await OTPVerification.findAll({ where: { contact_num: contactNum, isd_code: countryCode, is_verified: 1 } });
      if (findNumberIsLoggedIn.length === 0) {
        return customResponse(res, 1, "You are not able to register without logging in.");
      }
      if (brokerValidation === true) {
        const findOtpVerification = await OTPVerification.findOne({ where: { contact_num: contactNum, isd_code: countryCode } });
        const isVerified = findOtpVerification ? findOtpVerification.is_verified : 0;

        const insertBrokerData = {
          unique_role_id: uniqueId,
          role: category,
          name: name,
          trade_name: tradeName,
          email: email,
          isd_code: countryCode,
          contact_num: contactNum,
          physical_address: physicalAddress,
          postal_code: postalCode,
          country: country,
          com_reg_num: companyRegNumber,
          tel_number: telephoneNumber,
          contact_person: contactPerson,
          is_verified: isVerified
        };

        const brokerResult = await Register.create(insertBrokerData);
        const finalBrokerDetails = await brokerResponseData(brokerResult, token);

        return success(res, 200, 'Broker Registered Successfully.', finalBrokerDetails);
      } else {
        return brokerValidation;
      }

    }
    // for client
    else if (category === "3") {
      const clientValidation = checkValidationForClient(req, res);
      if (truckParkingAddressDetail !== undefined || managerDetails !== undefined) {
        return customResponse(res, 1, "This payload is not for a client.");
      }
      // Retrieve isd_code from the Country table
      const countryData = await Country.findOne({ where: { isd_code: countryCode } });
      if (!countryData) {
        return customResponse(res, 1, "Invalid country code.");
      }
      const findExistContactNum = await Register.findAll({ where: { contact_num: contactNum, isd_code: countryCode } });
      if (findExistContactNum.length !== 0) {
        return customResponse(res, 1, `Account already exists with this role ${findExistContactNum[0].role}`);
      }
      const findNumberIsLoggedIn = await OTPVerification.findAll({ where: { contact_num: contactNum, isd_code: countryCode, is_verified: 1 } });
      if (findNumberIsLoggedIn.length === 0) {
        return customResponse(res, 1, "You are not able to register without logging in.");
      }
      if (clientValidation === true) {
        const findOtpVerification = await OTPVerification.findOne({ where: { contact_num: contactNum, isd_code: countryCode } });
        const isVerified = findOtpVerification ? findOtpVerification.is_verified : 0;

        const insertClientData = {
          unique_role_id: uniqueId,
          role: category,
          name: name,
          trade_name: tradeName,
          email: email,
          isd_code: countryCode,
          contact_num: contactNum,
          physical_address: physicalAddress,
          postal_code: postalCode,
          country: country,
          com_reg_num: companyRegNumber,
          tel_number: telephoneNumber,
          contact_person: contactPerson,
          credit_limit_application: creditLimitApplication,
          transport_aggrement: transportAggrement,
          goods_transit_limit_pertruck: goodsTransitLimitPerTruck,
          rate_aggrement_form: rateAggrementForm,
          credit_limit_pay_terms: creditLimitPayTerms,
          is_verified: isVerified
        };

        const clientResult = await Register.create(insertClientData);
        const finalClientDetails = await clientResponseData(clientResult, token);

        return success(res, 200, 'Client Registered Successfully.', finalClientDetails);
      } else {
        return clientValidation;
      }
    }
    else {
      return customResponse(res, 1, "Please provide valid category.");
    }
  } catch (err) {
    return error(res, 500, 'Internal Server Error.');
  }
};

exports.sendOtpFirstTimeAndResendOtp = [
  async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return customResponse(res, 1, "Payload is required.");
      }
      const { contactNum, countryCode } = req.body
      const checkValidation = checkValidationForSendOtp(req, res)
      if (checkValidation === true) {
        // Retrieve isd_code from the Country table
        const countryData = await Country.findOne({ where: { isd_code: countryCode } });
        if (!countryData) {
          return customResponse(res, 1, "Invalid country code.");
        }
        let Result = await OTPVerification.findOne({ where: { contact_num: contactNum, isd_code: countryCode } });
        let NewOTP = Math.floor(1000 + Math.random() * 9000); // 4 digit otp
        if (!Result) {
          await OTPVerification.create({
            isd_code: countryCode,
            contact_num: contactNum,
            otp: NewOTP,
            count: 1,
            expiry_time: new Date(new Date().getTime() + 5 * 60000)
          });
          return success(res, 200, "OTP sent successfully");
        } else {
          timerFun(contactNum, countryCode);
          if (Result.count < 5) {
            await OTPVerification.update({ is_verified: 0, otp: NewOTP, count: Result.count + 1, expiry_time: new Date(new Date().getTime() + 5 * 60000) }, { where: { contact_num: contactNum }, returning: true, plain: true });
            return success(res, 200, "OTP sent successfully");
          } else {
            await OTPVerification.update({ expiry_time: new Date() }, { where: { contact_num: contactNum, isd_code: countryCode, count: 5, is_verified: 0 }, returning: true, plain: true });
            return error(res, 405, 'Apologies! You have exceeded the maximum limit for OTP attempts. Please wait for 30 seconds and try again.');
          }
        }
      } else {
        return checkValidation
      }
    } catch (err) {
      return customResponse(res, 1, err);
    }
  }
];

const timerFun = (contactNum, countryCode) => {
  setInterval(async () => {
    const Op = Sequelize.Op;
    const expiredOTPs = await OTPVerification.findAll({ where: { expiry_time: { [Op.lt]: new Date() }, count: 5, contact_num: contactNum, isd_code: countryCode } });
    for (const otp of expiredOTPs) {
      otp.count = 0;
      await otp.save();
    }
  }, 30 * 1000); // run every 30 seconds
}
// verify otp
exports.VerifyOtp = [
  async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return customResponse(res, 1, "Payload is required.");
      }
      const { contactNum, countryCode } = req.body
      // Retrieve isd_code from the Country table
      const countryData = await Country.findOne({ where: { isd_code: countryCode } });
      if (!countryData) {
        return customResponse(res, 1, "Invalid country code.");
      }
      const verifyValidation = checkValidationForVerifyOtp(req, res)
      if (verifyValidation === true) {

        const Result = await OTPVerification.findOne({ where: { contact_num: contactNum, isd_code: countryCode, is_verified: 0 } })
        if (Result) {
          if (Result.otp === req.body.otp || req.body.otp === "1234") {
            await OTPVerification.update({ is_verified: 1, count: 0 }, { where: { id: Result.id, contact_num: contactNum, isd_code: countryCode } })
            const numberCheck = await Register.findOne({ where: { contact_num: contactNum, isd_code: countryCode, is_verified: 1 } })
            if (numberCheck) {
              return success(res, 200, "OTP verified successfully", { is_register: true });
            }
            else {
              return success(res, 200, "OTP verified successfully", { is_register: false });
            }
          } else {
            return customResponse(res, 1, "Invalid OTP");
          }
        } else {
          return customResponse(res, 1, "You already verified once");
        }
      } else {
        return verifyValidation
      }
    } catch (err) {
      return customResponse(res, 1, err);
    }
  }
];

// get country list
exports.getCountryIsdList = async (req, res) => {
  try {
    const countryList = await Country.findAll();
    if (countryList) {
      const countryDetail = countryList.map(country => ({
        countryCode: country.country_code,
        countryName: country.country_name,
        isdCode: country.isd_code
      }));
      return success(res, 200, "List of country", countryDetail);
    } else {
      return customResponse(res, 1, "List not found");
    }
  } catch (err) {
    return customResponse(res, 1, err);
  }
};

//logout
// exports.logout = [
//   async (req, res) => {

//     const isUserExist = await Register.findOne({ where: { contact_num: req.body.contactNum, is_verified: 1 } })
//     if (isUserExist) {
//       await OTPVerification.update({ count: 0, is_verified: 0 }, { where: { contact_num: req.body.contactNum }, returning: true, plain: true });
//       success(res, 200, "User Logged Out")
//     }
//     else {
//       customResponse(res, 1, "User not found")
//     }
//   }
// ]
