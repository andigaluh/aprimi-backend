const { authJwt } = require("../middlewares");
const news = require("../controllers/news.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Read all news
  router.get("/", news.findAll);

  // Read all featured news
  router.get("/featured", news.findAllFeatured);

  // Read all published news
  router.get("/published", news.findAllPublished);

  // Read all news
  router.get("/:id", news.findOne);

  app.use("/news", router);
};
