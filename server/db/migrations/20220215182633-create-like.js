'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    }, {
      timestamps: false
    });

    await queryInterface.addConstraint('likes', {
      fields: ['post_id'],
      type: 'foreign key',
      references: {
        table: 'posts',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');
  }
};
