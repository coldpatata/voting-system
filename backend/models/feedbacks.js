module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        student_id: {
            type:DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    }, {
        timestamps: true,
    });

    return Feedback;
};
