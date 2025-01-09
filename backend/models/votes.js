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
            references: {
                model: 'Ballot',
                key: 'ballot_id',
            },
        },
        candidate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Participants',
                key: 'participant_id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'user_id',
            },
        },
        vote_timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    }, {
        tableName: 'votes',
        timestamps: false,
    });

    // Define Associations
    Votes.associate = (models) => {
        Votes.belongsTo(models.Ballot, {
            foreignKey: 'ballot_id',
            as: 'ballot',
            onDelete: 'CASCADE',
        });
        Votes.belongsTo(models.Participants, {
            foreignKey: 'candidate_id',
            as: 'candidate',
            onDelete: 'CASCADE',
        });
        Votes.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return Votes;
};
