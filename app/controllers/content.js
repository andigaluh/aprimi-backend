const db = require("../models");
const Content = db.content;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
}; 

// Read all contents
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Content.findAndCountAll({
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
                message: err.message || "Some error occurred while retrieving contents.",
            });
        });
};

// Read all contents
exports.findAllAbout = (req, res) => {
    Content.findAll({
        where: {id: [1,2]},
        order: [['id', 'DESC']]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving contents.",
            });
        });
};

// Create and Save a new Content
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    // Create a content
    const content = {
        url_title: req.body.url_title,
        title: req.body.title,
        content: req.body.content,
        created_user_id: req.userId
    };

    // Save content in the database
    Content.create(content)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Content.",
            });
        });
};

// Activate / non-activate user by id
exports.activate = (req, res) => {
    //const id = req.params.id;
    const id = req.params.id;
    const status = (req.params.status == "true") ? true : false;

    Content.update({
        is_publish: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == true) {
                    res.send({
                        message: "Content is publish",
                    });
                } else {
                    res.send({
                        message: "Content is not-publish",
                    });
                }
            } else {
                res.send({
                    message: `Cannot update Content with id=${id}. Maybe Content was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Content with id=" + id,
            });
        });
};

// Read content by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Content.findByPk(id, {})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error retrieving Content with id=" + id,
            });
        });
};

// Update and save an content
exports.update = (req, res) => {
    const id = req.params.id;

    Content.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Content was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Content with id=${id}. Maybe Content was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Content with id=" + id,
            });
        });
}; 


// Delete content by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Content.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Content was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Content with id=${id}. Maybe Content was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Content with id=" + id,
            });
        });
};

// Read all contents
exports.whatWeDoSummary = (req, res) => {
    const title = req.query.title;

    Content.findAll({
        where: {
            id: 7
        },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving contents.",
            });
        });
};

// Read all contents
exports.whatWeDo = (req, res) => {
    const title = req.query.title;
    
    Content.findAll({
        where: {
            id : [4,5,6]
        },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving contents.",
            });
        });
};