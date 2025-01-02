module.exports = (sequelize, Sequelize) => {
    const Position = sequelize.define('Position', {
        position_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        position_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        max_vote_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'positions',
        timestamps: false
    });

    return Position;
};