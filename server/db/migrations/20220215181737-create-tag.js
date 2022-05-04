'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });

    // await queryInterface.addConstraint('tags', {
    //   fields: ['post_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: 'posts',
    //     field: 'id'
    //   },
    //   onDelete: 'cascade'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tags');
  }
};
