const content = require("../controllers/content.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Read all events
    router.get("/", content.whatWeDo);

    // Read all events
    router.get("/summary", content.whatWeDoSummary);

    app.use("/whatwedo", router);
};
