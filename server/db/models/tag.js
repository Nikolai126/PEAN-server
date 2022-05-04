'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    static associate(models) {
    }
  }
  tag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tag',
    tableName: 'tags',
    timestamps: false
  });
  return tag;
};
