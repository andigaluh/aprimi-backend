module.exports = (sequelize, Sequelize) => {
    const Agenda = sequelize.define("agenda", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
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
        }
    });

    return Agenda;
};
