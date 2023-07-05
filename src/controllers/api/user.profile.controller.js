const { User } = require("../../sql-connections/models");
const { body, validationResult } = require("express-validator");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getUsersResponseData } = require("../../helpers/response/parse-response.js");
const uploadFile = require("../../middlewares/uploads/uploads.js");

// get by ID
exports.GetUserProfileById = async (req, res) => {
    try {
        if (req.query.userId == '') {
            customResponse(res, 1, 'Please provide user id.');
        }
        else {
            const profile = await User.findOne({ where: { user_id: req.query.userId,is_deleted:0 } });
            if (profile) {
                const finalUserDetails = await getUsersResponseData(profile)
                success(res, 200, 'Data Found', finalUserDetails)
            }
            else {
                customResponse(res, 1, 'No User Found with this user id in our system.')
            }
        }
    } catch (err) {
        customResponse(res, 1, err.message)
    }
}

// update profile
exports.updateUserProfile = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            User.findOne({ where: { user_id: req.body.userId,is_deleted:0 } }).then(user => {
                if (user) {
                    var profileDetails = {}
                    let name = req.body.name ? req.body.name : '';
                    let email = req.body.email ? req.body.email : '';
                    if (name != '') {
                        profileDetails.name = name
                    }
                    if (email != '') {
                        profileDetails.email = email
                    }
                    User.update(profileDetails, { where: { user_id: req.body.userId,is_deleted:0 } }).then(async updated => {
                        const profile = await User.findOne({ where: { user_id: req.body.userId,is_deleted:0 } });
                        if (profile) {
                            const finalUserDetails = await getUsersResponseData(profile)
                            success(res, 200, 'Profile Updated successfully', finalUserDetails)
                        }
                        else {
                            customResponse(res, 1, 'No User Found with this user id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "User not found")
                }
            }).catch(userFindError => {
                customResponse(res, 1, userFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]

// upload image
exports.uploadProfilePic = [
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                customResponse(res, 1, errors.array()[0].msg, errors.array());
            }
            await uploadFile(req, res);
            User.findOne({ where: { user_id: req.query.userId } }).then(user => {
                if (user) {
                    var profileDetails = {}
                    let profile_pic = req.file ? req.file.originalname : '';
                    if (profile_pic != '') {
                        profileDetails.profile_pic = profile_pic
                    }
                    User.update(profileDetails, { where: { user_id: req.query.userId,is_deleted:0} }).then(async updated => {
                        const app = await User.findOne({ where: { user_id: req.query.userId,is_deleted:0 } });
                        if (app) {
                            const finalProfileDetails = await getUsersResponseData(app)
                            success(res, 200, 'Profile Pic Uploaded successfully', finalProfileDetails)
                        }
                        else {
                            customResponse(res, 1, 'No User id Found with this id in our system.')
                        }
                    }).catch(err => {
                        customResponse(res, 1, err);
                    });
                }
                else {
                    customResponse(res, 1, "User not found")
                }
            }).catch(appFindError => {
                customResponse(res, 1, appFindError)
            })

        } catch (err) {
            customResponse(res, 1, err);
        }
    }
]