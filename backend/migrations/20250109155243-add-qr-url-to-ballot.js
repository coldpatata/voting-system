module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ballot', 'qr_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ballot', 'qr_url');
  },
};
