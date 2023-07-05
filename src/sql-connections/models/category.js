'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
    }
  }
  Category.init({
    category_name: DataTypes.STRING,
    category_description: DataTypes.TINYINT,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'category',
      freezeTableName: true,
      tableName: 'category'
    });
  return Category;
};