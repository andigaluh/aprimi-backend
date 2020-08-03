const { authJwt } = require("../middlewares");
const users = require("../controllers/user.js");
const news_category = require("../controllers/news_category.js");
const news = require("../controllers/news.js");
const upload = require("../middlewares/upload");
const event_category = require("../controllers/event_category.js");
const event = require("../controllers/event.js");
const company = require("../controllers/company.js");
const content = require("../controllers/content.js");
const event_registration = require("../controllers/event_reg.js");
const media = require("../controllers/media.js");
const uploadMedia = require("../middlewares/media");
const contact = require("../controllers/contact.js");
const carousel = require("../controllers/carousel.js");
const uploadCarousel = require("../middlewares/upload_carousel");
const logo = require("../controllers/logo.js");
const agenda = require("../controllers/agenda.js");

module.exports = (app) => {
    var router = require("express").Router();

    // Retrieve all Users
    router.get("/users", [authJwt.verifyToken, authJwt.isAdmin], users.findAll);
    // Retrieve a single User with id
    router.get("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], users.findOne);
    // Update a User with id
    router.put("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], users.update);
    // Delete a User with id
    router.delete("/users/:id", [authJwt.verifyToken, authJwt.isAdmin], users.delete);
    // Activaate a user with id
    router.put("/users/activate/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], users.activate)


    // Create a new news_category
    router.post("/news_category", [authJwt.verifyToken, authJwt.isAdmin], news_category.create);
    // Retrieve all news_categorys
    router.get("/news_category", [authJwt.verifyToken, authJwt.isAdmin], news_category.findAll);
    // Retrieve a single news_category with id
    router.get("/news_category/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.findOne);
    // Update a news_category with id
    router.put("/news_category/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.update);
    // Delete a news_category with id
    router.delete("/news_category/:id", [authJwt.verifyToken, authJwt.isAdmin], news_category.delete);



    // Create a new news
    router.post("/news", [authJwt.verifyToken, authJwt.isAdmin], news.create);
    router.post("/news/:id/thumbnail", [authJwt.verifyToken, authJwt.isAdmin, upload.single("thumbnail")], news.thumbnail);
    // Read all news
    router.get("/news", [authJwt.verifyToken, authJwt.isAdmin], news.findAll);
    // Read news by id
    router.get("/news/:id", [authJwt.verifyToken, authJwt.isAdmin], news.findOne);
    // Update news by id
    router.put("/news/:id", [authJwt.verifyToken, authJwt.isAdmin], news.update);
    // Delete news by id
    router.delete("/news/:id", [authJwt.verifyToken, authJwt.isAdmin], news.delete);
    // Activate/non-activate news by id and status
    router.put("/news/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], news.activate);


    // Create an event category
    router.post("/event_category", [authJwt.verifyToken, authJwt.isAdmin], event_category.create);
    // Retrieve all event_categorys
    router.get("/event_category", [authJwt.verifyToken, authJwt.isAdmin], event_category.findAll);
    // Retrieve a single event_category with id
    router.get("/event_category/:id", [authJwt.verifyToken, authJwt.isAdmin], event_category.findOne);
    // Update a event_category with id
    router.put("/event_category/:id", [authJwt.verifyToken, authJwt.isAdmin], event_category.update);
    // Delete a event_category with id
    router.delete("/event_category/:id", [authJwt.verifyToken, authJwt.isAdmin], event_category.delete);


    // Create a new event
    router.post("/event", [authJwt.verifyToken, authJwt.isAdmin], event.create);
    router.post("/event/:id/thumbnail", [authJwt.verifyToken, authJwt.isAdmin, upload.single("thumbnail")], event.thumbnail);
    router.post("/event/:id/files", [authJwt.verifyToken, authJwt.isAdmin, upload.single("file")], event.file);
    // Retrieve all event
    router.get("/event", [authJwt.verifyToken, authJwt.isAdmin], event.findAll);
    // Retrieve a single event with id
    router.get("/event/:id", [authJwt.verifyToken, authJwt.isAdmin], event.findOne);
    // Update a event with id
    router.put("/event/:id", [authJwt.verifyToken, authJwt.isAdmin], event.update);
    // Delete a event with id
    router.delete("/event/:id", [authJwt.verifyToken, authJwt.isAdmin], event.delete);
    // Activate / non-activate an event with id and status
    router.put("/event/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], event.activate);



    // create member company
    router.post("/company", company.create)
    // activate / non-activate membership
    router.put("/membership/:id/:status", [ authJwt.verifyToken, authJwt.isAdmin], company.activate);
    // read all membership
    router.get("/membership", [authJwt.verifyToken, authJwt.isAdmin], company.findAll);
    // read membership by id
    router.get("/membership/:id", [authJwt.verifyToken, authJwt.isAdmin], company.findOne);
    // update membership by id
    router.put("/membership/:id", [authJwt.verifyToken, authJwt.isAdmin], company.update);
    // delete membership by id
    router.delete("/membership/:id", [authJwt.verifyToken, authJwt.isAdmin], company.delete);



    // create content
    router.post("/content", [authJwt.verifyToken, authJwt.isAdmin], content.create)
    // activate/non-activate content
    router.put("/content/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], content.activate)
    // read all content
    router.get("/content", [authJwt.verifyToken, authJwt.isAdmin], content.findAll);
    // read content by id
    router.get("/content/:id", [authJwt.verifyToken, authJwt.isAdmin], content.findOne);
    // update content by id
    router.put("/content/:id", [authJwt.verifyToken, authJwt.isAdmin], content.update);
    // delete content by id
    router.delete("/content/:id", [authJwt.verifyToken, authJwt.isAdmin], content.delete);



    // read all event registration
    router.get("/event_reg", [authJwt.verifyToken, authJwt.isAdmin], event_registration.allRegistration)
    // read all event registration with event_id
    router.get("/event_reg/event/:id", [authJwt.verifyToken, authJwt.isAdmin], event_registration.allRegistrationbyevent)
    // read event registration with id
    router.get("/event_reg/:id", [authJwt.verifyToken, authJwt.isAdmin], event_registration.RegistrationbyId)
    // update confirmation with id
    router.put("/event_reg/confirm/:id", [authJwt.verifyToken, authJwt.isAdmin], event_registration.confirmation)
    // update event registration with id
    router.put("/event_reg/:id", [authJwt.verifyToken, authJwt.isAdmin], event_registration.updateRegistrationById)
    // delete event registration with id
    router.delete("/event_reg/:id", [authJwt.verifyToken, authJwt.isAdmin], event_registration.delete)

    
    // create media
    router.post("/media", [authJwt.verifyToken, authJwt.isAdmin, uploadMedia.single("file")], media.uploadFiles)
    // read all media
    router.get("/media", [authJwt.verifyToken, authJwt.isKomiteOrAdmin], media.findAll)
    // delete media by id
    router.delete("/media/:id", [authJwt.verifyToken, authJwt.isKomiteOrAdmin], media.deleteById)


    // read all contact
    router.get("/contact", [authJwt.verifyToken, authJwt.isAdmin], contact.findAll)
    // read contact by id
    router.get("/contact/:id", [authJwt.verifyToken, authJwt.isAdmin], contact.findOne)
    // delete contact by ids
    router.delete("/contactbyids", [authJwt.verifyToken, authJwt.isAdmin], contact.deleteByIds)
    // delete contact by id
    router.delete("/contact/:id", [authJwt.verifyToken, authJwt.isAdmin], contact.delete)


    // create carousel
    //router.post("/carousel", [authJwt.verifyToken, authJwt.isAdmin, uploadCarousel.single("image")], carousel.create)
    router.post("/carousel", [authJwt.verifyToken, authJwt.isAdmin], carousel.createWithoutImage);
    // update carousel image
    router.post("/carousel/:id/image", [authJwt.verifyToken, authJwt.isAdmin, uploadCarousel.single("image")], carousel.image);
    // update carousel fields
    router.put("/carousel/:id", [authJwt.verifyToken, authJwt.isAdmin], carousel.update);
    // read all carousel
    router.get("/carousel", [authJwt.verifyToken, authJwt.isAdmin], carousel.findAll)
    // read carousel by id
    router.get("/carousel/:id", [authJwt.verifyToken, authJwt.isAdmin], carousel.findOne)
    // delete carousel by id
    router.delete("/carousel/:id", [authJwt.verifyToken, authJwt.isAdmin], carousel.delete)
    // activate carousel by id
    router.put("/carousel/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], carousel.activate);


    // create logo
    router.post("/logo", [authJwt.verifyToken, authJwt.isAdmin], logo.create)
    // update logo image
    router.post("/logo/:id/image", [authJwt.verifyToken, authJwt.isAdmin, uploadCarousel.single("image")], logo.image);
    // update logo fields
    router.put("/logo/:id", [authJwt.verifyToken, authJwt.isAdmin], logo.update);
    // read all logo
    router.get("/logo", [authJwt.verifyToken, authJwt.isAdmin], logo.findAll)
    // read logo by id
    router.get("/logo/:id", [authJwt.verifyToken, authJwt.isAdmin], logo.findOne)
    // delete logo by id
    router.delete("/logo/:id", [authJwt.verifyToken, authJwt.isAdmin], logo.delete)
    // activate logo by id
    router.put("/logo/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], logo.activate);

    // create agenda
    router.post("/agenda", [authJwt.verifyToken, authJwt.isAdmin], agenda.create)
    // update agenda fields
    router.put("/agenda/:id", [authJwt.verifyToken, authJwt.isAdmin], agenda.update);
    // read all agenda
    router.get("/agenda", [authJwt.verifyToken, authJwt.isAdmin], agenda.findAll)
    // read agenda by id
    router.get("/agenda/:id", [authJwt.verifyToken, authJwt.isAdmin], agenda.findOne)
    // delete agenda by id
    router.delete("/agenda/:id", [authJwt.verifyToken, authJwt.isAdmin], agenda.delete)
    // activate agenda by id
    router.put("/agenda/:id/:status", [authJwt.verifyToken, authJwt.isAdmin], agenda.activate);


    app.use("/admin", router);
};
