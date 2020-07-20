module.exports = (sequelize, Sequelize) => {
    const Carousel = sequelize.define("carousel", {
        image: {
            type: Sequelize.STRING,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url_title: {
            type: Sequelize.STRING,
        },
        url_link: {
            type: Sequelize.STRING,
        },
        content: {
            type: Sequelize.TEXT,
        },
        promo: {
            type: Sequelize.TEXT,
        },
        promo_link: {
            type: Sequelize.STRING
        },
        is_publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        updated_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return Carousel;
};
