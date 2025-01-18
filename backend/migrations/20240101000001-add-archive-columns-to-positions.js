module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('positions', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    await queryInterface.addColumn('positions', 'archived_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('positions', 'is_active');
    await queryInterface.removeColumn('positions', 'archived_at');
  }
};
