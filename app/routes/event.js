const { authJwt } = require("../middlewares");
const event = require("../controllers/event.js");
const event_registration = require("../controllers/event_reg.js");

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

    // Retrieve a single User with id
    //router.get("/me", [authJwt.verifyToken], event.findMe);

    // Update a User with id
    //router.put("/me", [authJwt.verifyToken], event.updateMe);

    // Delete a User with id
    //router.delete("/me", [authJwt.verifyToken], event.delete);

    app.use("/event", router);
};
