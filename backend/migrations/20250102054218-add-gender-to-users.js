'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.STRING,  
      allowNull: true,      
    });
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('users', 'gender');
  }
};

//npx sequelize-cli db:migrate

//npx sequelize-cli db:migrate:undo
