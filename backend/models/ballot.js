module.exports = (sequelize, Sequelize) => {
    const Ballot = sequelize.define('Ballot', {
        ballot_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        ballot_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        opening_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        closing_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        year_level_eligibility: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'ballots',
        timestamps: false,
    });

    return Ballot;
};
