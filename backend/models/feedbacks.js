module.exports = (sequelize, DataTypes) => {
  const Feedbacks = sequelize.define('Feedbacks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'being_evaluated', 'resolved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('immediate', 'non_immediate'),
      defaultValue: 'non_immediate',
      allowNull: false
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    evaluation_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'feedbacks',
    timestamps: false,
  });

  Feedbacks.associate = (models) => {
    Feedbacks.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  return Feedbacks;
};
