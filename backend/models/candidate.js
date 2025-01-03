module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middle_initial: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        suffix: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        candidate_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        photo_url: {
            type: DataTypes.TEXT, // Stores file path or URL
            allowNull: true,
        },
    }, {
        timestamps: false, // Disables createdAt and updatedAt
    });

    return Candidate;
};
