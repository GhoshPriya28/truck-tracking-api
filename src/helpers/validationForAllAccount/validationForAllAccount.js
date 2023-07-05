const { customResponse } = require("../response/api-response.js");

function checkValidationForTransporter(req, res) {
    const {
        name,
        tradeName,
        email,
        contactNum,
        countryCode,
        physicalAddress,
        postalCode,
        country,
        companyRegNumber,
        contactPerson,
        truckParkingAddressDetail,
        managerDetails
    } = req.body;

    if (!name || name === "") {
        return customResponse(res, 1, "Please provide name.");
    } else if (!tradeName || tradeName === "") {
        return customResponse(res, 1, "Please provide tradeName.");
    } else if (!email || email === "") {
        return customResponse(res, 1, "Please provide email.");
    } else if (contactNum === undefined || contactNum === null || contactNum === "") {
        return customResponse(res, 1, "Please provide contactNum.");
    }else if (countryCode === undefined || countryCode === null || countryCode === "") {
        return customResponse(res, 1, "Please provide countryCode.");
    } else if (!physicalAddress || physicalAddress === "") {
        return customResponse(res, 1, "Please provide physicalAddress.");
    } else if (!postalCode || postalCode === "") {
        return customResponse(res, 1, "Please provide postalCode.");
    } else if (!country || country === "") {
        return customResponse(res, 1, "Please provide country.");
    } else if (!companyRegNumber || companyRegNumber === "") {
        return customResponse(res, 1, "Please provide companyRegNumber.");
    } else if (!contactPerson || contactPerson === "") {
        return customResponse(res, 1, "Please provide contactPerson.");
    } else if (!truckParkingAddressDetail || truckParkingAddressDetail === "") {
        return customResponse(res, 1, "Please provide truckParkingAddressDetail.");
    } else if (!managerDetails || managerDetails === "") {
        return customResponse(res, 1, "Please provide managerDetails.");
    }

    return true; // for pass
}

function checkValidationForBroker(req, res) {
    const {
        name,
        tradeName,
        email,
        countryCode,
        contactNum,
        physicalAddress,
        postalCode,
        country,
        companyRegNumber,
        contactPerson,
    } = req.body;

    if (!name || name === "") {
        return customResponse(res, 1, "Please provide name.");
    } else if (!tradeName || tradeName === "") {
        return customResponse(res, 1, "Please provide tradeName.");
    } else if (!email || email === "") {
        return customResponse(res, 1, "Please provide email.");
    }else if (contactNum === undefined || contactNum === null || contactNum === "") {
        return customResponse(res, 1, "Please provide contactNum.");
    }else if (countryCode === undefined || countryCode === null || countryCode === "") {
        return customResponse(res, 1, "Please provide countryCode.");
    } else if (!physicalAddress || physicalAddress === "") {
        return customResponse(res, 1, "Please provide physicalAddress.");
    } else if (!postalCode || postalCode === "") {
        return customResponse(res, 1, "Please provide postalCode.");
    } else if (!country || country === "") {
        return customResponse(res, 1, "Please provide country.");
    } else if (!companyRegNumber || companyRegNumber === "") {
        return customResponse(res, 1, "Please provide companyRegNumber.");
    } else if (!contactPerson || contactPerson === "") {
        return customResponse(res, 1, "Please provide contactPerson.");
    }

    return true;
}

function checkValidationForClient(req, res) {
    const {
        name,
        tradeName,
        contactNum,
        countryCode,
        physicalAddress,
        postalCode,
        country,
        companyRegNumber,
        contactPerson,
        creditLimitApplication,
        transportAggrement,
        goodsTransitLimitPerTruck,
        creditLimitPayTerms,
        rateAggrementForm
    } = req.body;

    if (!name || name === "") {
        return customResponse(res, 1, "Please provide name.");
    } else if (!tradeName || tradeName === "") {
        return customResponse(res, 1, "Please provide tradeName.");
    } else if (contactNum === undefined || contactNum === null || contactNum === "") {
        return customResponse(res, 1, "Please provide contactNum.");
    }else if (countryCode === undefined || countryCode === null || countryCode === "") {
        return customResponse(res, 1, "Please provide countryCode.");
    } else if (!physicalAddress || physicalAddress === "") {
        return customResponse(res, 1, "Please provide physicalAddress.");
    } else if (!postalCode || postalCode === "") {
        return customResponse(res, 1, "Please provide postalCode.");
    } else if (!country || country === "") {
        return customResponse(res, 1, "Please provide country.");
    } else if (!companyRegNumber || companyRegNumber === "") {
        return customResponse(res, 1, "Please provide companyRegNumber.");
    } else if (!contactPerson || contactPerson === "") {
        return customResponse(res, 1, "Please provide contactPerson.");
    } else if (!creditLimitApplication || creditLimitApplication === "") {
        return customResponse(res, 1, "Please provide creditLimitApplication.");
    } else if (!transportAggrement || transportAggrement === "") {
        return customResponse(res, 1, "Please provide transportAggrement.");
    } else if (!goodsTransitLimitPerTruck || goodsTransitLimitPerTruck === "") {
        return customResponse(res, 1, "Please provide goodsTransitLimitPerTruck.");
    }else if (!creditLimitPayTerms || creditLimitPayTerms === "") {
        return customResponse(res, 1, "Please provide creditLimitPayTerms.");
    }else if (!rateAggrementForm || rateAggrementForm === "") {
        return customResponse(res, 1, "Please provide rateAggrementForm.");
    }

    return true;
}

function checkValidationForVerifyOtp(req, res) {
    const {
        contactNum,
        otp,
        countryCode
    } = req.body;

    if (!contactNum || contactNum === "" ) {
        return customResponse(res, 1, "Please provide Contact Number.");
    }
    else if (!otp || otp === "" ) {
      return customResponse(res, 1, "Please provide OTP.");
  }else if (countryCode === undefined || countryCode === null || countryCode === "") {
    return customResponse(res, 1, "Please provide countryCode.");
}

    return true;
}
function checkValidationForSendOtp(req, res) {
    const {
        contactNum,
        countryCode
    } = req.body;

    if (!contactNum || contactNum === "" ) {
        return customResponse(res, 1, "Please provide Contact Number.");
    }
    else if (countryCode === undefined || countryCode === null || countryCode === "") {
    return customResponse(res, 1, "Please provide countryCode.");
}

    return true;
}
module.exports = { checkValidationForTransporter, checkValidationForBroker, checkValidationForClient, checkValidationForVerifyOtp, checkValidationForSendOtp };
