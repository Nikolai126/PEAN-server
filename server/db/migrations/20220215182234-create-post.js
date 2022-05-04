'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      tag_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      image_ref: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });

    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'cascade'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
