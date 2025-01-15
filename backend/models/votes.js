module.exports = (sequelize, DataTypes) => {
    const Votes = sequelize.define('Votes', {
        vote_id: {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
        tableName: 'Votes' // Add explicit table name
    });

    // Define Associations
    Votes.associate = (models) => {
        Votes.belongsTo(models.Ballot, {
            foreignKey: 'ballot_id',
            as: 'ballot',
        });
        Votes.belongsTo(models.Candidates, {
            foreignKey: 'candidate_id',
            as: 'candidate',
        });
        Votes.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user',
        });
    };

    return Votes;
};
