module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    tableName: 'Notifications',
  });

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Notifications;
};
