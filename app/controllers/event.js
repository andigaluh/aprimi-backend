const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Events = db.event;
const Events_category = db.event_category;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
}; 

// Read all events
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Events.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ["id", "title", "date_event", "location", "headline", "content", "content_member_fee", "content_nonmember_fee", "is_publish", "is_featured", "createdAt", "event_category_id","thumbnail","file"],
        include: [{
            model: Events_category,
            as: "event_category",
            attributes: ["id", "title"]
        }, {
            model: users,
            as: "created_user",
            attributes: ["id", "name"]
        }],
        order: [['id', 'DESC']]
    })
        .then((data) => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving events.",
            });
        });
};

// Read all featured events
exports.findAllFeatured = (req, res) => {
        Events.findAll({
        where: { is_featured: 1, is_publish: 1 },
        attributes: ["id", "title", "date_event", "location", "headline", "content", "content_member_fee", "content_nonmember_fee", "is_publish", "is_featured", "createdAt", "event_category_id","thumbnail","file"],
        include: [{
            model: Events_category,
            as: "event_category",
            attributes: ["id", "title"]
        }, {
            model: users,
            as: "created_user",
            attributes: ["id", "name"]
        }],
        order: [['id', 'DESC']]
    })
        .then((data) => {
            //const response = getPagingData(data, page, limit);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving events.",
            });
        });
};

// Read all featured events
exports.findAllPublished = (req, res) => {
    Events.findAll({
        where: { is_publish: 1 },
        attributes: ["id", "title", "date_event", "location", "headline", "content", "content_member_fee", "content_nonmember_fee", "is_publish", "is_featured", "createdAt", "event_category_id", "thumbnail", "file"],
        include: [{
            model: Events_category,
            as: "event_category",
            attributes: ["id", "title"]
        }, {
            model: users,
            as: "created_user",
            attributes: ["id", "name"]
        }],
        order: [['id', 'DESC']]
    })
        .then((data) => {
            //const response = getPagingData(data, page, limit);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving events.",
            });
        });
};

// Create and Save a new Events
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    if (!req.body.date_event) {
        res.status(400).send({
            message: "Date event can not be empty!",
        });
        return;
    }

    if (!req.body.location) {
        res.status(400).send({
            message: "Location event can not be empty!",
        });
        return;
    }

    if (!req.body.headline) {
        res.status(400).send({
            message: "Headline event can not be empty!",
        });
        return;
    }

    // Create a event
    const event = {
        title: req.body.title,
        date_event: req.body.date_event,
        location: req.body.location,
        headline: req.body.headline,
        content: req.body.content,
        content_member_fee: req.body.content_member_fee,
        content_nonmember_fee: req.body.content_nonmember_fee,
        event_category_id: req.body.event_category_id,
        created_user_id: req.userId
    };

    // Save event in the database
    Events.create(event)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Events.",
            });
        });
};

// Update and save an event
exports.update = (req, res) => {
    const id = req.params.id;

    Events.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Events was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Events with id=${id}. Maybe Events was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Events with id=" + id,
            });
        });
};

// Read event by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Events.findByPk(id, {
        attributes: ["id", "title", "date_event", "location", "headline", "content", "content_member_fee", "content_nonmember_fee", "is_publish", "is_featured", "createdAt","event_category_id","thumbnail","file"],
        include: [{
            model: Events_category,
            as: "event_category",
            attributes: ["id", "title"]
        }, {
            model: users,
            as: "created_user",
            attributes: ["id", "name"]
        }]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error retrieving Events with id=" + id,
            });
        });
};

// Delete event by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Events.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Events was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Events with id=${id}. Maybe Events was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Events with id=" + id,
            });
        });
};

// upload thumbnail event
exports.thumbnail = (req, res) => {
    try {
        console.log(req.file);
        const id = req.params.id;
        const splitUrl = req.url.split("/")

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Events.findByPk(id, { attributes: ["thumbnail"] }).then((result) => {

            if (result) {
                fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + splitUrl[3] + "/" +result.thumbnail, () => { });
            }

            //const thumbnailName = `${Date.now()}-${req.file.originalname}`;
            const thumbnailName = `${id}-${req.file.originalname}`;
            Events.update({ thumbnail: thumbnailName.toLowerCase() }, { where: { id: id } })
                .then((image) => {
                    return res.send(`File has been uploaded.`);
                })
                .catch((error) => {
                    return res.status(400).send(`Error when upload new image ${error}`);
                });

        }).catch((error) => {
            return res.status(400).send(`Error fetch old image ${error}`);
        });


    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .send(`Error when trying upload images: ${error}`);
    }
};

// upload files event
exports.file = (req, res) => {
    try {
        //return console.log(req.url.split("/"));
        const id = req.params.id;
        const splitUrl = req.url.split("/")

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Events.findByPk(id, { attributes: ["file"] }).then((result) => {

            if (result) {
                fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + splitUrl[3] + "/" + result.file, () => { });
            }

            //const thumbnailName = `${Date.now()}-${req.file.originalname}`;
            const thumbnailName = `${id}-${req.file.originalname}`;
            Events.update({ file: thumbnailName.toLowerCase() }, { where: { id: id } })
                .then((image) => {
                    return res.send(`File has been uploaded.`);
                })
                .catch((error) => {
                    return res.status(400).send(`Error when upload new file ${error}`);
                });

        }).catch((error) => {
            return res.status(400).send(`Error fetch old file ${error}`);
        });


    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .send(`Error when trying upload images: ${error}`);
    }
};

// activate / non-activate an event by id and status
exports.activate = (req, res) => {
    const id = req.params.id;
    const status = (req.params.status == "true") ? 1 : 0;

    Events.update({
        is_publish: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == 1) {
                    res.send({
                        message: "Events was activate.",
                    });
                } else {
                    res.send({
                        message: "Events was non-activate.",
                    });
                }
            } else {
                res.send({
                    message: `Cannot activate/non-activate Events with id=${id}. Maybe Events was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error activate/non-activate Events with id=" + id,
            });
        });
};



