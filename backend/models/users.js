module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define('Users', {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middle_initial: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    year_level: {
      type: Sequelize.ENUM('Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'),
      validate: {
        isIn: [['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']]
      }
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'User_roles',
        key: 'role_id',
      },
    },
    contact_number: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    suffix: {
      type: Sequelize.STRING,
    
    },
    gender: {
      type: Sequelize.STRING,
    },
    profile_url: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'https://grammedia-vids.s3.ap-southeast-2.amazonaws.com/boy.png',
    },
  }, {
    tableName: 'Users',
    timestamps: false,
  });

  Users.associate = (models) => {
   
    Users.belongsTo(models.UserRoles, {
      foreignKey: 'role_id',
      as: 'role',
    });

    // Association with Votes
    Users.hasMany(models.Votes, {
      foreignKey: 'user_id',
      as: 'votes',
      onDelete: 'CASCADE',
    });

    // Add this association
    Users.hasMany(models.Feedbacks, {
      foreignKey: 'user_id',
      as: 'feedbacks'
    });
  };

  return Users;
};
