const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig');

// Initialize Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    min: dbConfig.pool.min,
    max: dbConfig.pool.max,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Define the db object to store models and Sequelize instances
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
const models = {
  Users: require('./users')(sequelize, Sequelize),
  UserRoles: require('./user_roles')(sequelize, Sequelize),
  Announcements: require('./announcement')(sequelize, Sequelize),
  Positions: require('./position')(sequelize, Sequelize),
  Candidates: require('./candidate')(sequelize, Sequelize),
  Ballot: require('./ballot')(sequelize, Sequelize),
  Participants: require('./participants')(sequelize, Sequelize),
  Votes: require('./votes')(sequelize, Sequelize),
  Feedbacks: require('./feedbacks')(sequelize, Sequelize),
};

// Initialize all model associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export db object with models and Sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize
};
