'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('haslikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'posts',
          key: 'id'
        }
      },
    }, {
      timestamps: false
    });

  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('haslikes');
  }
};
