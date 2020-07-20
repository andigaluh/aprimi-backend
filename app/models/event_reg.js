module.exports = (sequelize, Sequelize) => {
    const Event_registration = sequelize.define("event_registration", {
        invoiced_to: {
            type: Sequelize.INTEGER(1),
            defaultValue: 1
        },
        ww_id: {
            type: Sequelize.STRING
        },
        report_name: {
            type: Sequelize.STRING
        },
        report_date: {
            type: Sequelize.DATE
        },
        report_job: {
            type: Sequelize.STRING
        },
        report_phone: {
            type: Sequelize.STRING
        },
        report_email: {
            type: Sequelize.STRING
        },
        report_fax: {
            type: Sequelize.STRING
        },
        report_address: {
            type: Sequelize.TEXT,
        },
        invoice_name: {
            type: Sequelize.STRING
        },
        invoice_email: {
            type: Sequelize.STRING
        },
        invoice_phone: {
            type: Sequelize.STRING
        },
        invoice_address: {
            type: Sequelize.STRING
        },
        invoice_fax: {
            type: Sequelize.STRING
        },
        invoice_notes: {
            type: Sequelize.STRING
        },
        exam_remarks: {
            type: Sequelize.TEXT
        },
        is_confirmation: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        confirmation_date: {
            type: Sequelize.DATE
        },
        confirmation_user_id: {
            type: Sequelize.INTEGER
        }
    });

    return Event_registration;
};
