'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    static associate(models) {
    }
  }
  token.init({
    user_id: DataTypes.INTEGER,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'token',
    tableName: 'tokens',
    timestamps: false
  });
  return token;
};
