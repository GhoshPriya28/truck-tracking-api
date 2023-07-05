'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
    }
  }
  Users.init({
    user_id: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    verification_code:DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    ref_password: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    //address: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.STRING,
    is_verify: DataTypes.TINYINT,
    is_deleted: DataTypes.TINYINT,
    access_token: DataTypes.TEXT
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'users',
      freezeTableName: true,
      tableName: 'users'
    });
  return Users;
};