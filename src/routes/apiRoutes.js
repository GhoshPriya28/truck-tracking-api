const { Router } = require('express');
const apiRouter = Router();
const { success, error} = require("../helpers/response/api-response.js");
const { verifyToken } = require("../middlewares/auth/jwtAuth.js");
const {checkDuplicateEmailOrPhone, checkClientsDuplicateEmailOrPhone, checkDuplicatePhone} = require("../middlewares/validation/verifySignUp.js");

const userAuthController = require("../controllers/api/user.auth.controller.js");
const userProfileController = require('../controllers/api/user.profile.controller.js')

//priya ghosh 
// importing validation
const {checkValidationForRegister} = require("../middlewares/validation/authValidation.js")
//transporter
const authController = require("../controllers/api/auth.controller.js")
const categoryController = require("../controllers/api/categorylist.controller.js")
const fileController = require("../controllers/api/fileupload.controller.js")
const vehicleController = require("../controllers/api/vehicle.controller.js")
const uploadFile = require("../middlewares/uploads/uploads.js")

apiRouter.get('/', (req, res, next) => {
  logger.info("Checking the API status: Everything is OK");
  success(res,200,"Welcome to Books REST API by The JavaScript Dojo")
});

// register
apiRouter.post("/register", authController.register)
//sendotpresendotp
apiRouter.post("/send-resend-otp", authController.sendOtpFirstTimeAndResendOtp)
//verify otp
apiRouter.post("/verify-otp", authController.VerifyOtp)
// apiRouter.post("/logout", authController.logout)
apiRouter.get("/get-country-list", authController.getCountryIsdList)

//category
apiRouter.post("/create-category", categoryController.createCategory)
apiRouter.get("/category-list", categoryController.getAllListCategory)

//file upload
apiRouter.post("/doc-upload", fileController.uploadFileForAll)

//vehicles 
 apiRouter.post("/add-detail", uploadFile, vehicleController.addDetails)







//User login routes
apiRouter.post("/user-register", checkDuplicatePhone, userAuthController.userRegister);
apiRouter.post("/user-verify-otp", userAuthController.userVerifyOtp);
apiRouter.post("/user-resend-otp", userAuthController.userResendOtp);
apiRouter.get("/get-all-user", userAuthController.getAllUser);
apiRouter.delete("/user-delete", userAuthController.deleteById);

//User profile routes
apiRouter.get('/get-userprofile-by-id', verifyToken, userProfileController.GetUserProfileById);
apiRouter.put('/update-user-profile',  verifyToken, userProfileController.updateUserProfile);
apiRouter.post('/upload-user-profile-pic', verifyToken, userProfileController.uploadProfilePic);

apiRouter.all('*', (req, res, next) =>
  error(res,404,"Route Un-available")
);

module.exports = apiRouter;