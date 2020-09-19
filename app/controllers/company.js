const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Company = db.company;
const User = db.users;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
};

// Read all membership
exports.findAll = (req, res) => {
    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Company.findAndCountAll({
        where: condition,
        limit,
        offset,
        include: [
            {
                model: User,
                as: "created_user",
                attributes: ["id", "name", "email"]
            }
        ],
        order: [['id', 'DESC']]
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

// Create and Save a new Company
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Name can not be empty!",
        });
        return;
    }

    // Create a company
    const company = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        fax: req.body.fax,
        contact_person_name: req.body.contact_person_name,
        contact_person_title: req.body.contact_person_title,
        contact_person_phone: req.body.contact_person_phone,
        contact_person_email: req.body.contact_person_email,
        authorized_name: req.body.authorized_name,
        authorized_title: req.body.authorized_title,
        year_registered: req.body.year_registered,
        created_user_id: req.userId,
        updated_user_id: req.userId,

    };

    // Save company in the database
    Company.create(company)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Company.",
            });
        });
};

// Activate / non-activate user by id
exports.activate = (req, res) => {
    //const id = req.params.id;
    const id = req.params.id;
    const status = (req.params.status == "true") ? true : false;

    Company.update({
        is_active: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == true) {
                    res.send({
                        message: "Membership is active",
                    });
                } else {
                    res.send({
                        message: "Membership is not-active",
                    });
                }
            } else {
                res.send({
                    message: `Cannot update Membership with id=${id}. Maybe Membership was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Membership with id=" + id,
            });
        });
};



// Read company by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Company.findByPk(id, {
        include: [
            {
                model: User,
                as: "created_user",
                attributes: ["id", "name", "email"]
            }]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send({
            message: err.message || "Error retrieving Company with id=" + id,
        });
    });
};

// Update and save an company
exports.update = (req, res) => {
    const id = req.params.id;

    Company.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Company was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Company with id=${id}. Maybe Company was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Company with id=" + id,
            });
        });
};

// Delete company by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Company.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Company was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Company with id=${id}. Maybe Company was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Company with id=" + id,
            });
        });
};

exports.upload = async (req, res) => {
    try {
        const splitUrl = req.url.split("/")

        if (req.file == undefined) {
            return res.send(`You must select a file`)
        }

        const id = req.body.id;

        Company.update(
            {
                is_active: true,
                confirmation_status: true,
                confirmation_date: new Date(),
                confirmation_file: req.file.filename
            }, {
            where: { id: id },
        })
            .then((num) => {
                if (num == 1) {
                    res.send({
                        message: "File has been uploaded.",
                    });
                } else {
                    res.send({
                        message: `Cannot update Company with id=${id}. Maybe Company was not found or req.body is empty!`,
                    });
                }
            })
            .catch((err) => {
                res.status(400).send({
                    message: "Error updating Company with id=" + id,
                });
            });
        /* const uploaded = await Company.create({
            is_active: true,
            confirmation_status: true,
            confirmation_date: new Date(),
            confirmation_file: req.file.filename
        }); */

        return res.send(`File has been uploaded.`);


    } catch (error) {
        console.log(error);
        return res.status(500).send(`Error when trying upload images: ${error}`);
    }
}



