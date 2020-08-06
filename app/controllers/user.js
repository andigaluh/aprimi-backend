const db = require('../models');
const User = db.users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = db.company
const getPagination = require("../middlewares/getPagination");
const encDec = require("../middlewares/encDec");
const config = require("../config/auth.config")
const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
}; 

// Read all users
exports.findAll = (req, res) => {
  const { page, size, name } = req.query;
  const { limit, offset } = getPagination(page, size);
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  User.findAndCountAll({
    where: condition,
    limit,
    offset,
    attributes: ["id", "name", "email", "status", "createdAt", "updatedAt"],
    include: [
      {
        model: Company,
        as: "company",
      },
    ],
    order: [['id','DESC']]
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "Email can not be empty!"
        });
        return;
    }

    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!"
        });
        return
    }

    if (!req.body.password) {
      res.status(400).send({
        message: "Password can not be empty!",
      });
      return;
    }

    // Create a user
    const user = {
      email: req.body.email,
      name: req.body.name,
      password: await bcrypt.hash(req.body.password, 8),
      //published: req.body.published ? req.body.published : false
    };

    // Save user in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(400).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
}; 

// Update and save an user
exports.update = (req, res) => {
  const id = req.params.id;
  //const id = req.userId;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Read user by id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  
  User.findByPk(id, {
    attributes: ["id", "name", "email", "status", "createdAt", "updatedAt","company_id"],
    include: [
      {
        model: Company,
        as: "company"
      }
    ]
  })
    .then((data) => {
      var authorities = [];
      data.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }

        res.status(200).send({
          id: data.id,
          name: data.name,
          email: data.email,
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          company_id: data.company_id,
          company:{
            id : data.company.id,
            name : data.company.name,
          },
          roles: authorities,
        });
      });
      //res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Read user by login
exports.findMe = async (req, res) => {
  const id = req.userId;
  
  User.findByPk(id, {
    attributes: ["id", "name", "email", "status", "createdAt", "updatedAt", "company_id"],
    include: [
      {
        model: Company,
        as: "company"
      }
    ]
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update and save an user by login
exports.updateMe = (req, res) => {
  //const id = req.params.id;
  const id = req.userId;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Update and save an user by login
exports.updatePasswordByMe = (req, res) => {
  //const id = req.params.id;
  const id = req.userId;

  User.update(
    { password: bcrypt.hashSync(req.body.password, 8) },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Password was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete user by login
exports.deleteMe = (req, res) => {
  //const id = req.params.id;
  const id = req.userId;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete user by id
exports.delete = (req, res) => {
  const id = req.params.id;
  //const id = req.userId;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Activate / non-activate user by id
exports.activate = (req, res) => {
  //const id = req.params.id;
  const id = req.params.id;
  const status = (req.params.status == "true") ? true : false;

  User.update({
    status: status
  }, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        if (status == true) {
          res.send({
            message: "User is active",
          });
        } else {
          res.send({
            message: "User is not-active",
          });
        }
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.logout = (req, res) => {
  const id = req.userId
  const logoutToken = ""
  User.update({
    accesstoken: logoutToken
  }, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was Logout.",
        });
      } else {
        res.send({
          message: `Cannot logout User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error logout User with id=" + id,
      });
    });
}

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.komiteBoard = (req, res) => {
  res.status(200).send("Komite Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.checkPassword = (req, res) => {
  const id = req.userId;
  const oldPassword = req.body.oldPassword;
  User.findByPk(id, {
    attributes: [
      "password",
    ]
  }).then((data) => {
    var passwordIsValid = bcrypt.compareSync(oldPassword, data.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        error: 1,
        status: 0,
        message: "Invalid current password!",
      });
    }
      res.send({
        error: 0,
        status: 1,
        message: "Valid password!",
      });
    }).catch((err) => {
      res.status(400).send({
        message: err,
      });
    });
}

// Activate / non-activate user by id
exports.activateByEmail = (req, res) => {
  //const id = req.params.id;
  const id = encDec.decryptedString(req.params.id);
  const status = true;

  User.update({
    status: status
  }, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        if (status == true) {
          /* res.send({
            message: "User is active",
          }); */
          res.redirect(config.CORSURL + "/activation-user");
        } else {
          res.send({
            message: "User is not-active",
          });
        }
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.params is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};