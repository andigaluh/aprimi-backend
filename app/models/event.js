module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
        thumbnail: {
            type: Sequelize.STRING,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        date_event: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        headline: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
        },
        content_member_fee: {
            type: Sequelize.TEXT,
        },
        content_nonmember_fee: {
            type: Sequelize.TEXT,
        },
        file: {
            type: Sequelize.STRING,
        },
        is_publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        is_featured: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return Event;
};
