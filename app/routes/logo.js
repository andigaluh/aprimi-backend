const { authJwt } = require("../middlewares");
const logo = require("../controllers/logo.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Read all news
  router.get("/", logo.findAllActive);

  // Read all logo
  router.get("/:id", logo.findOne);

  app.use("/logo", router);
};
