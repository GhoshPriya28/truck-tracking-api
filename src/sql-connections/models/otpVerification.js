'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OtpVerification extends Model {
    static associate(models) {
    }
  }
  OtpVerification.init({
    contact_num: DataTypes.STRING,
    isd_code: DataTypes.STRING,
    otp: DataTypes.STRING,
    is_verified: DataTypes.TINYINT,
    count: DataTypes.INTEGER,
    expiry_time: DataTypes.DATE,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'otpVerification',
      freezeTableName: true,
      tableName: 'otp_verification'
    });
  return OtpVerification;
};