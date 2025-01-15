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

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import and initialize models
db.Users = require('./users')(sequelize, Sequelize);
db.UserRoles = require('./user_roles')(sequelize, Sequelize);
db.Announcements = require('./announcement')(sequelize, Sequelize);
db.Positions = require('./position')(sequelize, Sequelize);
db.Candidates = require('./candidate')(sequelize, Sequelize);
db.Ballot = require('./ballot')(sequelize, Sequelize);
db.Participants = require('./participants')(sequelize, Sequelize);
db.Votes = require('./votes')(sequelize, Sequelize);
db.Feedbacks = require('./feedbacks')(sequelize, Sequelize);
db.AuditLogs = require('./audit_logs')(sequelize, Sequelize); // New model
db.ElectionResults = require('./election_results')(sequelize, Sequelize); // New model
db.Notifications = require('./notifications')(sequelize, Sequelize); // New model

// Define associations after all models are initialized
db.Users.belongsTo(db.UserRoles, { foreignKey: 'role_id', as: 'role' });
db.UserRoles.hasMany(db.Users, { foreignKey: 'role_id', as: 'users' });

// Votes associations
db.Votes.belongsTo(db.Candidates, {
  foreignKey: 'candidate_id',
  as: 'candidate'
});

db.Votes.belongsTo(db.Users, {
  foreignKey: 'user_id',
  as: 'user'
});

db.Candidates.hasMany(db.Votes, {
  foreignKey: 'candidate_id',
  as: 'votes'
});

// Ballot associations
db.Ballot.hasMany(db.Participants, {
  foreignKey: 'ballot_id',
  as: 'participants'
});

db.Participants.belongsTo(db.Ballot, {
  foreignKey: 'ballot_id',
  as: 'ballot'
});

// Add Feedback associations
db.Feedbacks.belongsTo(db.Users, {
  foreignKey: 'user_id',
  as: 'user'
});

db.Users.hasMany(db.Feedbacks, {
  foreignKey: 'user_id',
  as: 'feedbacks'
});

// Add AuditLogs associations
db.AuditLogs.belongsTo(db.Users, {
  foreignKey: 'user_id',
  as: 'user'
});

// Add ElectionResults associations
db.ElectionResults.belongsTo(db.Ballot, {
  foreignKey: 'ballot_id',
  as: 'ballot'
});

db.ElectionResults.belongsTo(db.Candidates, {
  foreignKey: 'candidate_id',
  as: 'candidate'
});

// Add Notifications associations
db.Notifications.belongsTo(db.Users, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = db;
