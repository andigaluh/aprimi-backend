module.exports = (sequelize, Sequelize) => {
    const Event_category = sequelize.define("event_category", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_publish: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return Event_category;
};
