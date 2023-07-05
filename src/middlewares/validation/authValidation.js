// const { customResponse } = require("../../helpers/response/api-response.js");

// // Email Validation
// const emailPattern = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
// // Contact Number Validation
// const contactNumPattern = /^\d{10}$/;
// // Name Validation
// const namePattern = /^[a-zA-Z ]+$/;
// // Postal Code Validation
// const postalCodePattern = /^\d{6}$/;
// // Company Registration Number Validation
// const companyRegNumPattern = /^\d+$/;




// checkValidationForRegister = (req, res, next) => {
//     const { category, name, tradeName, email, contactNum, physicalAddress, postalCode, country, companyRegNumber, telephoneNumber, contactPerson, truckParkingAddressDetail, managerDetails } = req.body;
//     if (category === '' || category === undefined || category === null) {
//         customResponse(res, 1, 'Please provide category.')
//     }
//     else if (name === '' || name === undefined || name === null) {
//         customResponse(res, 1, 'Please provide name.');
//     }
//     else if (!namePattern.test(name)) {
//         return customResponse(res, 1, "Invalid name. Only alphabetic characters and spaces are allowed.");
//       }
//     else if (tradeName === '' || tradeName === undefined || tradeName === null) {
//         customResponse(res, 1, 'Please provide tradeName.');
//     }
//     else if (email === '' || email === undefined || email === null) {
//         customResponse(res, 1, 'Please provide email.');
//     }
//     else if (!emailPattern.test(email)) {
//         return customResponse(res, 1, "Invalid email.");
//     }
//     else if (contactNum === undefined || contactNum === null) {
//         customResponse(res, 1, 'Please provide contactNum.');
//     }
//     else if (physicalAddress === '' || physicalAddress === undefined || physicalAddress === null) {
//         customResponse(res, 1, 'Please provide physicalAddress.');
//     }
//     else if (postalCode === '' || postalCode === undefined || postalCode === null) {
//         customResponse(res, 1, 'Please provide postalCode.');
//     }
//     else if (!postalCodePattern.test(postalCode)) {
//         return customResponse(res, 1, "Invalid postal code. Postal code should be a 6-digit number.");
//       }
//     else if (country === '' || country === undefined || country === null) {
//         customResponse(res, 1, 'Please provide country.');
//     }
//     else if (companyRegNumber === undefined || companyRegNumber === null) {
//         customResponse(res, 1, 'Please provide companyRegNumber.');
//     }
//     else if (!companyRegNumPattern.test(companyRegNumber)) {
//         return customResponse(res, 1, "Invalid company registration number. Only numbers are allowed.");
//       }
//     else if (contactPerson === '' || contactPerson === undefined || contactPerson === null) {
//         customResponse(res, 1, 'Please provide contactPerson.');
//     }
//     else if (truckParkingAddressDetail === '' || truckParkingAddressDetail === undefined || truckParkingAddressDetail === null) {
//         customResponse(res, 1, 'Please provide truckParkingAddressDetail.');
//     }
//     else if (managerDetails === '' || managerDetails === undefined || managerDetails === null) {
//         customResponse(res, 1, 'Please provide managerDetails.');
//     }
//     else {
//         next();
//     }
// };

// const validateFields = {
//     checkValidationForRegister: checkValidationForRegister
// };

// module.exports = validateFields;