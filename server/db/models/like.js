'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    static associate(models) {
      this.belongsTo(models.post, {
        foreignKey: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        hooks: true
      });
      this.hasOne(models.post, {
        sourceKey: 'post_id',
        foreignKey: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        hooks: true
      })
    }
  }
  like.init({
    post_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'like',
    tableName: 'likes',
    timestamps: false
  });
  return like;
};
