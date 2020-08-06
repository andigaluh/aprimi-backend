const { authJwt } = require("../middlewares");
const users = require("../controllers/user.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve a single User with id
  router.get("/me", [authJwt.verifyToken], users.findMe);

  // Update a User with id
  router.put("/me", [authJwt.verifyToken], users.updateMe);

  // Update a Password User with id
  router.put("/updatePassword", [authJwt.verifyToken], users.updatePasswordByMe);

  // Delete a User with id
  router.delete("/me", [authJwt.verifyToken], users.delete);

  // Logout
  router.put("/logout", [authJwt.verifyToken], users.logout);

   // Retrieve a single User with id
  router.post("/checkPassword", [authJwt.verifyToken], users.checkPassword);

  // Activaate a user by Email
  router.get("/activate/:id", users.activateByEmail)

  app.use("/users", router);
};
