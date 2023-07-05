// priya ghosh

require('dotenv').config();
const { Register } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Render Password Set page
exports.renderPasswordSet = async (req, res) => {
  try {
    res.render('admin/pages/passwordSet');      // Render the passwordSet.ejs view
  } catch (err) {
    return error(res, 500, 'Internal Server Error', err.message);     // Return an error response if an error occurs
  }
};
// Password set
// Password set
exports.passwordSet = async (req, res) => {
  try {
    const { email, password } = req.body;   // keys which will be in request.body

    const user = await Register.findOne({   // Find the user with role 1 and the provided email
      where: {
        role: 1,
        email: email
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Email ID with this role does not exist.' });
    }

    if (user.password) {    // If the user's password is already set, return a success response
      return customResponse(res, 200, 'Password already set. Password updated successfully!');
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;   // Update the user's password with the hashed password

    await user.save();  // Save the updated user in the database

    return success(res, 200, 'Password set successfully!');
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });   // Return an error response if an error occurs
  }
};



// login
exports.loginView = async (req, res) => {
  res.render('admin/pages/index', { error: null });     // Render the login view and pass an object with the "error" property set to null
};

// admin login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if email and role exist in the register table
    const user = await Register.findOne({ where: { email: email, role: ['1', '4'] } });

    if (user === null) {
      // If the user does not exist, render the same login page with an error message
      return res.render('admin/pages/index', { error: 'Transporter/Super Admin can login only' });
    }

    // If user is not having password it will throw error
    if (user.password === null) {
      return res.render('admin/pages/index', { error: 'User is not having password, please set password and login' })
    }

    // Step 2: Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If the password is invalid, render the same login page with an error message
      return res.render('admin/pages/index', { error: 'Invalid Email/Password' });
    }

    // Step 3: Generate and send JWT token for successful login (if required generate token or you can remove this)
    const token = jwt.sign({ email, role: user.role }, process.env.JWT_TOKEN_KEY);

    // Redirect to the dashboard page
    return res.redirect('/dashboardview');

  } catch (err) {
    return error(res, 500, 'Internal Server Error', err.message);   // Return an error response if an error occurs
  }
};

exports.dashboard = async (req, res) => {
  res.render('admin/pages/dashboard', { error: null });   // Render the dashboard view and pass an object with the "error" property set to null
};