'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
    }
  }
  Country.init({
    country_code: DataTypes.STRING,
    country_name: DataTypes.STRING,
    isd_code: DataTypes.STRING,
  },
    {
      timestamps: false,
      sequelize,
      modelName: ' country',
      freezeTableName: true,
      tableName: 'country'
    });
  return Country;
};