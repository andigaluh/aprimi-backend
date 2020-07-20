const { authJwt } = require("../middlewares");
const content = require("../controllers/content.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Read all events
    router.get("/", content.findAllAbout);

    app.use("/about", router);
};
