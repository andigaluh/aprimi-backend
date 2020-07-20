const { authJwt } = require("../middlewares");
const carousel = require("../controllers/carousel.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Read all events
  router.get("/", carousel.findAll);

  // Read all events
  router.get("/:id", carousel.findOne);

  app.use("/carousel", router);
};
