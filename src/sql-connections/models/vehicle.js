'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
    }
  }
  Vehicle.init({
    account_id: DataTypes.STRING,
    driver_name: DataTypes.STRING,
    contact_num: DataTypes.STRING,
    dl_num: DataTypes.STRING,
    dl_exp_date: DataTypes.STRING,
    dl_file_path: DataTypes.STRING,
    d_passport_num: DataTypes.STRING,
    d_passport_file_path: DataTypes.STRING,
    d_passport_exp_date: DataTypes.STRING,
    truck_detail: DataTypes.STRING,
    truck_file_path: DataTypes.STRING,
    trailer1_detail: DataTypes.STRING,
    trailer1_file: DataTypes.STRING,
    trailer2_detail: DataTypes.STRING,
    trailer2_file: DataTypes.STRING,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'vehicle',
      freezeTableName: true,
      tableName: 'vehicles'
    });
  return Vehicle;
};
