const { authJwt } = require("../middlewares");
const event = require("../controllers/event.js");
const event_registration = require("../controllers/event_reg.js");
const upload = require("../middlewares/upload");

module.exports = (app) => {
    var router = require("express").Router();

    // Read all events
    router.get("/", event.findAll);

    // Read all featured events
    router.get("/featured", event.findAllFeatured);

    // Read all featured events
    router.get("/published", event.findAllPublished);

    // Read all events
    router.get("/:id", event.findOne);

    // Event registration by event
    router.post("/registration/me/:id",[authJwt.verifyToken], event_registration.create);

    // Read my registration
    router.get("/registration/me",[authJwt.verifyToken], event_registration.myRegistration);

    // Read my registration by id
    router.get("/registration/me/:id", [authJwt.verifyToken], event_registration.myRegistrationById);

    // Update my registration by id
    router.put("/registration/me/:id", [authJwt.verifyToken], event_registration.updateMyRegistration);

    // Delete my registration by id
    router.delete("/registration/me/:id", [authJwt.verifyToken], event_registration.deleteMyRegistration);

    // Update image confirmation by id
    router.post("/confirmation/:id/thumbnail", [authJwt.verifyToken, upload.single("confirmation_image")], event_registration.confimation);

    app.use("/event", router);
};
