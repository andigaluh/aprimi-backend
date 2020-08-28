const dbConfig = require('../config/db.config');
const Sequelize = require("sequelize");
const news = require('./news');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  timezone: "+07:00",
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.role = require("./role.js")(sequelize, Sequelize);
db.news_category = require("./news_category.js")(sequelize, Sequelize);
db.news = require("./news.js")(sequelize, Sequelize);
db.images = require("./image.model.js")(sequelize, Sequelize);
db.event_category = require("./event_category.js")(sequelize, Sequelize);
db.event = require("./event.js")(sequelize, Sequelize);
db.company = require("./company.js")(sequelize, Sequelize);
db.exam = require("./exam.js")(sequelize, Sequelize);
db.event_registration = require("./event_reg.js")(sequelize, Sequelize);
db.content = require("./content.js")(sequelize, Sequelize);
db.media = require("./media.js")(sequelize, Sequelize);
db.contact = require("./contact.js")(sequelize, Sequelize);
db.carousel = require("./carousel.js")(sequelize, Sequelize);
db.logo = require("./logo.js")(sequelize, Sequelize);
db.agenda = require("./agenda.js")(sequelize, Sequelize);
db.event.belongsTo(db.event_category, { foreignKey: 'event_category_id', as: 'event_category' });
db.event.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.news.belongsTo(db.news_category, { foreignKey: 'news_category_id' });
db.news.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.company.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user', constraints: false});
db.users.belongsTo(db.company, { foreignKey: 'company_id', as: 'company' });
db.content.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.media.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.carousel.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.logo.belongsTo(db.users, { foreignKey: 'created_user_id', as: 'created_user' });
db.event_registration.belongsTo(db.event, {
  foreignKey: "event_id",
  as: "event",
});
db.event_registration.belongsTo(db.users, { 
  foreignKey: 'user_id', 
  as: 'user'
});
db.event_registration.belongsTo(db.exam, {
  foreignKey: 'exam_id',
  as: 'exam',
  constraints: false
});
db.role.belongsToMany(db.users, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.users.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.ROLES = ["user", "admin", "moderator", "komite"];
db.agenda.belongsTo(db.users, {foreignKey: 'created_user_id', as: 'created_user'})
db.agenda.belongsToMany(db.role, {
  through: "agenda_roles",
  foreignKey: "agendaId",
  otherKey: "roleId",
})
db.role.belongsToMany(db.agenda, {
  through: "agenda_roles",
  foreignKey: "roleId",
  otherKey: "agendaId"
})

module.exports = db;