const { authJwt } = require("../middlewares");
const content = require("../controllers/content.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Read all events
  router.get("/", content.findAll);

  // Read all events
  router.get("/:id", content.findOne);

  router.get("/items/what-we-do", content.whatWeDo);

  app.use("/content", router);
};
