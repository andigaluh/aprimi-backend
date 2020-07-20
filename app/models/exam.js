module.exports = (sequelize, Sequelize) => {
    const Exam = sequelize.define("exam", {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Exam;
};
