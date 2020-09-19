module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("company", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fax: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contact_person_email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        authorized_name: {
            type: Sequelize.STRING,
        },
        authorized_title: {
            type: Sequelize.STRING,
        },
        year_registered: {
            type: Sequelize.INTEGER(4),
            defaultValue: 2020
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        created_user_id: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        updated_user_id: {
            type: Sequelize.INTEGER,
        },
        confirmation_file: {
            type: Sequelize.STRING
        },
        confirmation_date: {
            type: Sequelize.DATE
        },
        confirmation_status: {
            type: Sequelize.BOOLEAN
        },
    });

    return Company;
};
