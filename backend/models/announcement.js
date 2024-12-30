module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define('Announcement', {
  
        announcement_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
   
        title_header: {
            type: Sequelize.STRING,
            allowNull: false,
        },
     
        time_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    
        image_url: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
      
        description_text: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
      
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'active',
         
        },
    }, {
        tableName: 'announcements', 
        timestamps: false, 
    });

    return Announcement;
};
