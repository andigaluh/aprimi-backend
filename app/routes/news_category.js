const news_category = require("../controllers/news_category.js");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new news_category
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], news_category.create);

  // Retrieve all news_categorys
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], news_category.findAll);

  // Retrieve a single news_category with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.findOne);

  // Update a news_category with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.update);

  // Delete a news_category with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.delete);

  app.use("/news_category", router);
};
