require('dotenv').config();
const { Op } = require("sequelize");
const { Register, Managers, TruckParkingAddress } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const { getPagination } = require("../../helpers/pagination/pagination.js");


// User List
exports.getUserList = async (req, res) => {
  try {
    // Parse the current page and limit from the query parameters, defaulting to 1 and 10 respectively
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const search = req.query.search || '';  // Get the search term from the query parameters, defaulting to an empty string

    const offset = (page - 1) * limit;  // Calculate the offset based on the current page and limit for pagination

    const { count, rows: users } = await Register.findAndCountAll({   // Fetch user data from the Register table
      attributes: ['id', 'name', 'role', 'email', 'contact_num'],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { role: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { contact_num: { [Op.like]: `%${search}%` } },
        ],
      },
      offset: offset,
      limit: limit,
    });

    const totalPages = Math.ceil(count / limit);    // Calculate total pages based on the count and limit

    res.render('admin/pages/userLists', {    // Render the userLists.ejs view and pass the users data, page, limit, count, totalPages, and search
      users,
      page,
      limit,
      count,
      totalPages,
      search,
    });
  } catch (err) {
    // Return 
    return customResponse(res, 1, err);
  }
};

// User Detail
exports.userDetail = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user details by ID from the database
    const user = await Register.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'role', 'email', 'contact_num', 'trade_name', 'physical_address', 'country', 'postal_code', 'com_reg_num', 'tel_number', 'manager_id', 'truck_park_id'],
    });

    if (!user) {
      // Return an error response if user is not found
      return customResponse(res, 1, 'User not found');
    }

    let managerData = null;
    let truckParkData = null;

    if (user.manager_id) {
      // Fetch manager data by manager_id from the database
      managerData = await Managers.findOne({
        where: { manager_id: user.manager_id },
        attributes: ['full_name', 'email', 'contact_num', 'isd_code'],
      });
    }

    if (user.truck_park_id) {
      // Fetch truck park data by truck_park_id from the database
      truckParkData = await TruckParkingAddress.findAll({
        where: { truck_park_id: user.truck_park_id },
        attributes: ['address'],
      });
    }

    // Render the 'userDetails.ejs' template and pass the user details, manager data, and truck park data
    res.render('admin/pages/userDetails', { user: user, managerData: managerData, truckParkData: truckParkData });

  } catch (err) {
    return customResponse(res, 1, err);    // Return an error response if an error occurs
  }
};
