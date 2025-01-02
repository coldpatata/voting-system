'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'profile_url', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMeN8O1Y5fBbaJgbSsFeMDJWiwUfevjwgr1w&s',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'profile_url');
  },
};
