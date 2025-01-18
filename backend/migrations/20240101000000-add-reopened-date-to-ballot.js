module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ballot', 'reopened_date', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'status' // This will add the column after the status column
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ballot', 'reopened_date');
  }
};
