const { authJwt } = require("../middlewares");
const company = require("../controllers/company.js");
const uploadMembership = require("../middlewares/membership");

module.exports = (app) => {
    var router = require("express").Router();

    // Create a new User
    router.post("/", company.create);

    // Find all active company
    router.get("/", company.findAll);

    // Find all active company
    router.get("/findMembership/:id", company.findOne);

    router.post("/upload", [uploadMembership.single("file")], company.upload)

    app.use("/membership", router);
};
