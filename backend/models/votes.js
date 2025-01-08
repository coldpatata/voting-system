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
                model: 'Ballot', // References the Ballot table
                key: 'ballot_id',
            },
        },
        candidate_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Participants', // References the Participants table
                key: 'participant_id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // References the Users table
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

    Votes.associate = (models) => {
        // Association with Ballot
        Votes.belongsTo(models.Ballot, {
            foreignKey: 'ballot_id',
            as: 'ballot',
            onDelete: 'CASCADE',
        });

        // Association with Participants
        Votes.belongsTo(models.Participants, {
            foreignKey: 'candidate_id',
            as: 'candidate',
            onDelete: 'CASCADE',
        });

        // Association with Users
        Votes.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return Votes;
};
