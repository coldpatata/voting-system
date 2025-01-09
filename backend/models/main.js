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
db.Users = require('./users')(sequelize, Sequelize);
db.UserRoles = require('./user_roles')(sequelize, Sequelize);
db.Announcements = require('./announcement')(sequelize, Sequelize);
db.Positions = require('./position')(sequelize, Sequelize);
db.Candidates = require('./candidate')(sequelize, Sequelize);
db.Ballot = require('./ballot')(sequelize, Sequelize);
db.Participants = require('./participants')(sequelize, Sequelize);
db.Votes = require('./votes')(sequelize, Sequelize);

// Define associations
db.Users.belongsTo(db.UserRoles, { foreignKey: 'role_id', as: 'role' });
db.UserRoles.hasMany(db.Users, { foreignKey: 'role_id', as: 'users' });
db.Ballot.hasMany(db.Participants, { foreignKey: 'ballot_id', as: 'participants' });
db.Participants.belongsTo(db.Ballot, { foreignKey: 'ballot_id', as: 'ballot' });
db.Votes.belongsTo(db.Participants, { foreignKey: 'candidate_id', as: 'candidate' }); // Change alias to 'candidate'
db.Participants.hasMany(db.Votes, { foreignKey: 'candidate_id', as: 'votes' });



// Export db object with models and Sequelize instance
module.exports = db;
