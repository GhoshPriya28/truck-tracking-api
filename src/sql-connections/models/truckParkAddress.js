'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TruckParkingAddress extends Model {
    static associate(models) {
    }
  }
  TruckParkingAddress.init({
    unique_role_id:DataTypes.STRING,
    truck_park_id: DataTypes.STRING,
    address: DataTypes.TEXT,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'truckParkAddress',
      freezeTableName: true,
      tableName: 'truck_park_address'
    });
  return TruckParkingAddress;
};