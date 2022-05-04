'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class haslike extends Model {
    static associate(models) {
    }
  }
  haslike.init({
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'haslike',
    tableName: 'haslikes',
    timestamps: false,
  });
  return haslike;
};
