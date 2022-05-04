'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: 'user_id'
      })
    }
  }
  post.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    tag_id: DataTypes.ARRAY(DataTypes.INTEGER),
    image_ref: DataTypes.TEXT,
    date: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'post',
    tableName: 'posts',
    timestamps: false
  });
  return post;
};
