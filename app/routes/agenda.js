const { authJwt } = require("../middlewares");
const agenda = require("../controllers/agenda.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Read all news
    router.get("/user", [authJwt.verifyToken],agenda.findAllPublished);

    // Read all news
    router.get("/komite", [authJwt.verifyToken, authJwt.isKomite], agenda.findAllPublished);

    // Read all agenda
    router.get("/:id", agenda.findOne);

    app.use("/agenda", router);
};
