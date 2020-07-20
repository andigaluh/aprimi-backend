module.exports = (sequelize, Sequelize) => {
  const News_category = sequelize.define("news_category", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_user_id: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
  });

  return News_category;
};
