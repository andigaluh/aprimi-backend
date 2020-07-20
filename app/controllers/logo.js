const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Logo = db.logo;
const User = db.users;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
}; 

// Read all newss
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Logo.findAndCountAll({
        where: condition,
        limit,
        offset,
        include: [{
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
                message: err.message || "Some error occurred while retrieving newss.",
            });
        });
};

// Read all newss
exports.findAllActive = (req, res) => {

    Logo.findAll({
        where: { is_publish: 1 },
        include: [{
            model: users,
            as: "created_user",
            attributes: ["id", "name"]
        }],
        order: [['id', 'DESC']]

    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving newss.",
            });
        });
};

exports.create = async (req, res) => {
    try {
        const title = req.body.title
        const url_title = req.body.url_title
        const url_link = req.body.url_link
        const is_publish = req.body.is_publish

        if (!title) {
            return res.status(500).send({
                message: `The title field is required`
            })
        }

        const logo = {
            
            title,
            url_title,
            url_link,
            is_publish
        }

        await Logo.create(logo).then((result) => {
            return res.send(result)
        }).catch((error) => {
            return res.status(500).send({
                message: `Failed to create logo : ${error}`
            })
        })
    } catch (error) {
        return res.status(500).send({
            message: `error occured ${error}`
        })
    }
}

exports.image = (req, res) => {
    try {
        console.log(req.file);
        const id = req.params.id;
        const splitUrl = req.url.split("/")


        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Logo.findByPk(id, { attributes: ["image"] }).then((result) => {

            if (result) {
                fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + result.image, () => { });
            }

            const imageName = `${req.file.originalname}`;
            Logo.update({ image: imageName.toLowerCase() }, { where: { id: id } })
                .then((image) => {
                    return res.send(`File has been uploaded.`);
                })
                .catch((error) => {
                    return res.status(400).send(`Error when upload new image ${error}`);
                });

        }).catch((error) => {
            return res.status(500).send(`Error fetch old image ${error}`);
        });


    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .send(`Error when trying upload images: ${error}`);
    }
};

// Update and save an news
exports.update = (req, res) => {
    const id = req.params.id;

    Logo.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Logo was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Logo with id=${id}. Maybe Logo was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Logo with id=" + id,
            });
        });
};

// Read news by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Logo.findByPk(id, {
        include: [{
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
                message: "Error retrieving Logo with id=" + id,
            });
        });
};



// Delete news by id
exports.delete = (req, res) => {
    const id = req.params.id;
    const splitUrl = req.url.split("/")

    Logo.findByPk(id, { attributes: ["image"] }).then((result) => {
        if (result) {
            fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + result.image, () => { });
        }

        Logo.destroy({
            where: { id: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "Logo was deleted successfully!",
                    });
                } else {
                    res.send({
                        message: `Cannot delete Logo with id=${id}. Maybe Logo was not found!`,
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Could not delete Logo with id=" + id,
                });
            });
    }).catch((error) => {
        return res.status(500).send({
            message: `failed to delete old image : ${error}`
        })
    })
};

// Update and save an news
exports.activate = (req, res) => {
    const id = req.params.id;
    const status = (req.params.status == "true") ? 1 : 0;
    Logo.update({
        is_publish: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == 1) {
                    res.send({
                        message: "Logo is active.",
                    });
                } else {
                    res.send({
                        message: "Logo is non-active.",
                    });
                }

            } else {
                res.send({
                    message: `Cannot activate/non-activate Logo with id=${id}. Maybe Logo was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error activate/non-activate Logo with id=" + id + " : " + err,
            });
        });
};