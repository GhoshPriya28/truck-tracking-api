'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    static associate(models) {
    }
  }
  Register.init({
    role: DataTypes.STRING,
    unique_role_id:DataTypes.STRING,
    name: DataTypes.STRING,
    trade_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    contact_num: DataTypes.STRING,
    isd_code: DataTypes.STRING,
    physical_address: DataTypes.TEXT,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    com_reg_num:DataTypes.STRING,
    tel_number:DataTypes.STRING,
    contact_person:DataTypes.STRING,
    truck_park_id: DataTypes.STRING,
    manager_id: DataTypes.STRING,
    credit_limit_application: DataTypes.STRING,
    transport_aggrement: DataTypes.STRING,
    goods_transit_limit_pertruck: DataTypes.STRING,
    rate_aggrement_form: DataTypes.STRING,
    credit_limit_pay_terms: DataTypes.STRING,
    is_verified: DataTypes.TINYINT,
    is_deleted: DataTypes.TINYINT,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'register',
      freezeTableName: true,
      tableName: 'register_data'
    });
  return Register;
};