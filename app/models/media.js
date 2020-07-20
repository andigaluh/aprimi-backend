module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define("media", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        data: {
            type: DataTypes.BLOB("long"),
        },
        created_user_id: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
  
    });

    return Media;
};
