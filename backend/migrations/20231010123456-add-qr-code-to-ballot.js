'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('ballot');
    if (!tableInfo.qr_code) {
      await queryInterface.addColumn('ballot', 'qr_code', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('ballot');
    if (tableInfo.qr_code) {
      await queryInterface.removeColumn('ballot', 'qr_code');
    }
  }
};
