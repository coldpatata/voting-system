module.exports = (sequelize, DataTypes) => {
  const Participants = sequelize.define('Participants', {
    participant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ballot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ballot', // References the Ballot table
        key: 'Ballot_ID',
      },
    },
    participant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.TEXT,
      allowNull: true, // Allow it to be nullable
    },
  }, {
    tableName: 'participants',
    timestamps: false,
  });

  Participants.associate = (models) => {
    Participants.belongsTo(models.Ballot, {
      foreignKey: 'ballot_id',
      as: 'ballot',
      onDelete: 'CASCADE',
    });
  };

  return Participants;
};
