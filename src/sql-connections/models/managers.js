'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Managers extends Model {
    static associate(models) {
    }
  }
  Managers.init({
    unique_role_id:DataTypes.STRING,
    manager_id: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_num: DataTypes.STRING,
    isd_code: DataTypes.STRING,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'manager',
      freezeTableName: true,
      tableName: 'managers'
    });
  return Managers;
};