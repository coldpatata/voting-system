module.exports = (sequelize, DataTypes) => {
  const AuditLogs = sequelize.define('AuditLogs', {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    details: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: false,
    tableName: 'AuditLogs',
  });

  AuditLogs.associate = (models) => {
    AuditLogs.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return AuditLogs;
};
