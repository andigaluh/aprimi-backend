module.exports = (sequelize, Sequelize) => {
    const Content = sequelize.define("content", {
        url_title: {
            type: Sequelize.STRING,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        is_publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });

    return Content;
};
