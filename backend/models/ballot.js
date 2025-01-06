module.exports = (sequelize, DataTypes) => {
    const Ballot = sequelize.define('Ballot', {
      ballot_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ballot_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      opening_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      closing_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      year_level_eligibility: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'OPEN',
      },
    }, {
      tableName: 'ballot',
      timestamps: false,
    });
  
    Ballot.associate = (models) => {
      Ballot.hasMany(models.Participants, {
        foreignKey: 'ballot_id',
        as: 'participants',
        onDelete: 'CASCADE',
      });
    };
  
    return Ballot;
  };
  