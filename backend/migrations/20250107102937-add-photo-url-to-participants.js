'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('participants', 'photo_url', {
      type: Sequelize.STRING,
      allowNull: true, // Matches the model definition
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('participants', 'photo_url');
  }
};
