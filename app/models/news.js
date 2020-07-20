module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("news", {
        thumbnail: {
            type: Sequelize.STRING,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        headline: {
            type: Sequelize.TEXT,
        },
        content: {
            type: Sequelize.TEXT,
        },
        is_publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        is_featured: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return News;
};
