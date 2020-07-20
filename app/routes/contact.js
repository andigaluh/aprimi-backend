const { authJwt } = require("../middlewares");
const contact = require("../controllers/contact.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Create a new User
    router.post("/", contact.create);

    app.use("/contact", router);
};
