module.exports = (sequelize, DataTypes) => {
  const ElectionResults = sequelize.define('ElectionResults', {
    result_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ballot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'ElectionResults',
  });

  ElectionResults.associate = (models) => {
    ElectionResults.belongsTo(models.Ballot, {
      foreignKey: 'ballot_id',
      as: 'ballot',
    });
    ElectionResults.belongsTo(models.Candidates, {
      foreignKey: 'candidate_id',
      as: 'candidate',
    });
  };

  return ElectionResults;
};
