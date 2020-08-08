const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Agenda = db.agenda;
const Role = db.role;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
};

// Read all agendas
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Agenda.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [['id', 'DESC']]
    })
        .then((data) => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving agendas.",
            });
        });
};

// Read all featured agendas
exports.findAllFeatured = (req, res) => {
    Agenda.findAll({
        where: { is_featured: 1, is_publish: 1 },
        order: [['id', 'DESC']]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving agendas.",
            });
        });
};

// Read all featured agendas
exports.findAllPublished = (req, res) => {
    Agenda.findAll({
        where: { is_publish: 1 },
        order: [['id', 'DESC']]
    })
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving agendas.",
        });
    });
};

// Create and Save a new Agenda
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    if (!req.body.start_date) {
        res.status(400).send({
            message: "Start Date can not be empty!",
        });
        return;
    }

    if (!req.body.end_date) {
        res.status(400).send({
            message: "End Date can not be empty!",
        });
        return;
    }

    // Create a agenda
    const agenda = {
        title: req.body.title,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        content: req.body.content,
        created_user_id: req.userId
    };

    // Save agenda in the database
    Agenda.create(agenda)
        .then((data) => {
            //res.send(data);
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles,
                        },
                    },
                }).then((roles) => {
                    data.setRoles(roles).then(() => {
                        res.send({message: "Agenda was registered successfully!"})
                    })
                })
            } else {
                data.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Agenda.",
            });
        });
};

// Update and save an agenda
exports.update = (req, res) => {
    const id = req.params.id;

    Agenda.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Agenda was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Agenda with id=${id}. Maybe Agenda was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Agenda with id=" + id,
            });
        });
};

// Read agenda by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Agenda.findByPk(id, {
        attributes: ["id", "title", "start_date", "end_date", "content", "is_publish", "is_featured", "createdAt", "created_user_id"],
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
              message: "error retriveing agenda with id=" + id + " error=" + err,
            });
        });
};

// Delete agenda by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Agenda.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Agenda was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Agenda with id=${id}. Maybe Agenda was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Agenda with id=" + id,
            });
        });
};

// activate / non-activate an agenda by id and status
exports.activate = (req, res) => {
    const id = req.params.id;
    const status = (req.params.status == "true") ? 1 : 0;

    Agenda.update({
        is_publish: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == 1) {
                    res.send({
                        message: "Agenda was activate.",
                    });
                } else {
                    res.send({
                        message: "Agenda was non-activate.",
                    });
                }
            } else {
                res.send({
                    message: `Cannot activate/non-activate Agenda with id=${id}. Maybe Agenda was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error activate/non-activate Agenda with id=" + id,
            });
        });
};



