const { authJwt } = require("../middlewares");
const company = require("../controllers/company.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Create a new User
    router.post("/", company.create);

    // Find all active company
    router.get("/", company.findAll);

    app.use("/membership", router);
};
