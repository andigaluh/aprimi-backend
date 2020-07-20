const db = require("../models");
const Event_category = db.event_category;

const Op = db.Sequelize.Op;

// Create and Save a new Event_category
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    // Create a event_category
    const event_category = {
        title: req.body.title,
        created_user_id: req.userId
    };

    // Save event_category in the database
    Event_category.create(event_category)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Event_category.",
            });
        });
};

// Update and save an event_category
exports.update = (req, res) => {
    const id = req.params.id;

    Event_category.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Event_category was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Event_category with id=${id}. Maybe Event_category was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Event_category with id=" + id,
            });
        });
};

// Read event_category by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Event_category.findByPk(id, {
        attributes: ["id", "title"],
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error retrieving Event_category with id=" + id,
            });
        });
};

// Read all event_categorys
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Event_category.findAll({
        where: condition,
        attributes: ["id", "title"],
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving event_categorys.",
            });
        });
};

// Delete event_category by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Event_category.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Event_category was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Event_category with id=${id}. Maybe Event_category was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Event_category with id=" + id,
            });
        });
};
