module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('announcements', 'status', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'active',
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('announcements', 'status');
  },
};
