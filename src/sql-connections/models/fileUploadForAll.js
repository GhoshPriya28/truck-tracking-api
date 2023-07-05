'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileUpload extends Model {
    static associate(models) {
    }
  }
  FileUpload.init({
    account_id: DataTypes.STRING,
    document_type: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING,
    expiry_date: DataTypes.STRING,
  },
    {
      timestamps: false,
      sequelize,
      modelName: 'fileUploadForAll',
      freezeTableName: true,
      tableName: 'file_upload_for_all'
    });
  return FileUpload;
};