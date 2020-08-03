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

  // Read all news by User
  router.get("/list/me", [authJwt.verifyToken, authJwt.isKomite],news.findAllByMe);

  router.post("/me", [authJwt.verifyToken, authJwt.isKomite], news.create);

  // Update news by id
  router.put("/:id", [authJwt.verifyToken, authJwt.isKomite], news.updateByMe);

  // Delete news by me id 
  router.delete("/:id", [authJwt.verifyToken, authJwt.isKomite], news.deleteByMe);

  app.use("/news", router);
};
