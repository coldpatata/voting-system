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
      validate: {
        isValidYearLevel(value) {
          if (value !== 'all') {
            const levels = value.split(',').map(level => level.trim());
            const validLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
            const isValid = levels.every(level => validLevels.includes(level));
            if (!isValid) {
              throw new Error('Invalid year level');
            }
          }
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'OPEN',
      validate: {
        isIn: [['OPEN', 'CLOSED', 'PENDING', 'REOPENED']]
      }
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submission_status: {
      type: DataTypes.ENUM('pending', 'submitted'),
      defaultValue: 'pending',
      allowNull: false
    },
    // Comment out or remove the reopened_date field temporarily
    /* reopened_date: {
      type: DataTypes.DATE,
      allowNull: true
    } */
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
        try {
          ballot.qr_code = await QRCode.toDataURL(JSON.stringify(qrData));
        } catch (error) {
          console.error('Error generating QR code:', error);
          ballot.qr_code = null;
        }

        // Set initial dates and status
        const now = new Date();
        const ballotOpeningDate = new Date(ballot.opening_date);
        const ballotClosingDate = new Date(ballot.closing_date);

        // Add 3 days to opening date
        ballotOpeningDate.setDate(ballotOpeningDate.getDate() + 3);
        ballot.opening_date = ballotOpeningDate;

        // Set status based on dates
        if (now < ballotOpeningDate) {
          ballot.status = 'PENDING';
        } else if (now > ballotClosingDate) {
          ballot.status = 'CLOSED';
        } else {
          ballot.status = 'OPEN';
        }
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
