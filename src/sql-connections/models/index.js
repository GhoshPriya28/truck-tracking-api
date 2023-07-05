'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

const config = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    dialect: 'mysql',
  },
  test: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: 'mysql',
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: 'mysql',
  },
};

let sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.User = require("../models/users.js")(sequelize, Sequelize);

//priya ghosh work start
db.OTPVerification = require("../models/otpVerification.js")(sequelize, Sequelize);
db.Managers = require("../models/managers.js")(sequelize, Sequelize);
db.Category = require("../models/category.js")(sequelize, Sequelize);
db.Country = require("../models/country.js")(sequelize, Sequelize);
db.TruckParkingAddress = require("../models/truckParkAddress.js")(sequelize, Sequelize);
db.Register = require("../models/register.js")(sequelize, Sequelize);
db.FileUploadForAll = require("../models/fileUploadForAll.js")(sequelize, Sequelize);
db.Vehicles = require("../models/vehicle.js")(sequelize, Sequelize);

// end



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;