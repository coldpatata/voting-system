const QRCode = require('qrcode');

module.exports = (sequelize, DataTypes) => {
  const Ballot = sequelize.define('Ballot', {
    ballot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ballot_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opening_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    closing_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    year_level_eligibility: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'OPEN',
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submission_status: {
      type: DataTypes.ENUM('pending', 'submitted'),
      defaultValue: 'pending',
      allowNull: false
    }
  }, {
    tableName: 'ballot',
    timestamps: false,
    hooks: {
      beforeCreate: async (ballot) => {
        // Generate QR code with ballot ID and other relevant information
        const qrData = {
          ballot_id: ballot.ballot_id,
          name: ballot.ballot_name,
          url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/ballot/${ballot.ballot_id}`
        };
        ballot.qr_code = await QRCode.toDataURL(JSON.stringify(qrData));
      }
    }
  });

  Ballot.associate = (models) => {
    Ballot.hasMany(models.Participants, {
      foreignKey: 'ballot_id',
      as: 'participants',
      onDelete: 'CASCADE',
    });
  };

  return Ballot;
};
