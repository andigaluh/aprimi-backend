module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        is_read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return Contact;
};
