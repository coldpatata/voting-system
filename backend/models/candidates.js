module.exports = (sequelize, Sequelize) => {
    const Candidate = sequelize.define('Candidate', {
        candidate_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        ballot_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        candidate_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        position: {
            type: Sequelize.STRING,
            allowNull: true, // Nullable as per your schema
        },
    }, {
        tableName: 'candidates',
        timestamps: false,
    });

    return Candidate;
};
