module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define('Position', {
        position_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        position_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        archived_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: false,
    });

    return Position;
};
