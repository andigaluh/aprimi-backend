const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Event_registration = db.event_registration;
const Exam = db.exam;
const Event = db.event;
const User = db.users;
const nodemailer = require('nodemailer')

const Op = db.Sequelize.Op;

/* var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "andy13galuh@gmail.com",
    pass: "k0mun1s#2019",
  },
}); */

// Create and Save a new Event_reg
exports.create = async (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id
    // Validate request
    if (!req.body.invoice_name) {
        res.status(400).send({
            message: "Invoice name can not be empty!",
        });
        return;
    }

    if (!req.body.invoice_email) {
        res.status(400).send({
            message: "Invoice email can not be empty!",
        });
        return;
    }

    if (!req.body.invoice_phone) {
        res.status(400).send({
            message: "Invoice phone can not be empty!",
        });
        return;
    }

    // Create a registration
    const registration = {
        user_id: userId,
        event_id: eventId,
        exam_id: req.body.exam_id,
        invoiced_to: req.body.invoiced_to,
        ww_id: req.body.ww_id,
        report_name: req.body.report_name,
        report_date: req.body.report_date,
        report_job: req.body.report_job,
        report_email: req.body.report_email,
        report_fax: req.body.report_fax,
        report_address: req.body.reporaddressax,
        invoice_name: req.body.invoice_name,
        invoice_email: req.body.invoice_email,
        invoice_phone: req.body.invoice_phone,
        invoice_fax: req.body.invoice_fax,
        invoice_notes: req.body.invoice_notes,
        exam_remarks: req.body.exam_remarks,
    };

    // Save news in the database
    Event_registration.count({
        where: {
            user_id: userId,
            event_id: eventId
        }   
    }).then(
        (data) => {
            if (data > 0) {
                res.status(400).send({
                    message: "You are already register this event."
                })
            } else {
                Event_registration.create(registration)
                    .then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        res.status(400).send({
                            message: err.message || "Some error occurred while creating the Registration.",
                        });
                    });
            }
        }
    ).catch(
        (err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Registration.",
            });
        }
    )
};

// Read my Registration
exports.myRegistration = (req, res) => {
    const userId = req.userId;
    Event_registration.findAll({
        where: {
            user_id: userId, 
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id","title","is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes:["id", "code", "title"]
            }
        ],
        order: [['id', 'DESC']]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};

// Read my Registration by id
exports.myRegistrationById = (req, res) => {
    const userId = req.userId;
    const id = req.params.id
    Event_registration.findAll({
        where: {
            user_id: userId,
            id: id,
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "title", "is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes: ["id", "code", "title"]
            }
        ]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};

// delete event registration by id
exports.deleteMyRegistration = (req, res) => {
    const userId = req.userId
    const id = req.params.id
    Event_registration.destroy({
        where: {
            user_id : userId,
            id: id
        }
    }).then((num) => {
        if (num == 1) {
            res.send({
                message: "Event registration was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Event registration with id=${id}. Maybe Event registration was not found!`,
            });
        }
    })
}

// update event registration by id
exports.updateMyRegistration = (req, res) => {
    const userId = req.userId
    const id = req.params.id
    Event_registration.update(req.body,{
        where: {
            user_id: userId,
            id: id
        }
    }).then((num) => {
        if (num == 1) {
            res.send({
                message: "Event registration was updated successfully.",
            });
        } else {
            res.send({
                message: `Cannot update Event registration with id=${id}. Maybe Event registration was not found or req.body is empty!`,
            });
        }
    })
}

// Read all Registration
exports.allRegistration = (req, res) => {
    Event_registration.findAll({
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "title", "is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes: ["id", "code", "title"]
            }
        ]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};

exports.allRegistrationbyevent = (req, res) => {
    const id = req.params.id
    Event_registration.findAll({
        where: {
            event_id: id
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "title", "is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes: ["id", "code", "title"]
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"]
            }
        ]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};

exports.RegistrationbyId = (req, res) => {
    const id = req.params.id
    Event_registration.findAll({
        where: {
            id: id
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "title", "is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes: ["id", "code", "title"]
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"]
            }
        ]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};

exports.confirmation = (req, res) => {
    const id = req.params.id
    const userId = req.userId
    Event_registration.update({
        is_confirmation: 1,
        confirmation_user_id: userId,
        confirmation_date: Date.now()
    }, {
        where: {
            id: id
        }
    }).then((num) => {
        if (num == 1) {
            res.send({
                message: "Event registration was confirmed.",
            });
        } else {
            res.send({
                message: `Cannot update confirmation registration with id=${id}. Maybe Event registration was not found or req.body is empty!`,
            });
        }
    })
}

exports.updateRegistrationById = (req, res) => {
    const id = req.params.id
    Event_registration.update(req.body, {
        where: {
            id: id
        }
    }).then((num) => {
        if (num == 1) {
            res.send({
                message: "Event registration was updated successfully.",
            });
        } else {
            res.send({
                message: `Cannot update Event registration with id=${id}. Maybe Event registration was not found or req.body is empty!`,
            });
        }
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Event_reg.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Event registration was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Event registration with id=${id}. Maybe Event registration was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Event registration with id=" + id,
            });
        });
};

exports.confimation = (req, res) => {
    try {
        console.log(req.file);
        const id = req.params.id;
        const splitUrl = req.url.split("/")

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Event_registration.findByPk(id, { attributes: ["confirmation_image"] }).then((result) => {

            if (result) {
                fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + splitUrl[3] + "/" + result.confirmation_image, () => { });
            }

            //const thumbnailName = `${Date.now()}-${req.file.originalname}`;
            const thumbnailName = `${id}-${req.file.originalname}`;
            Event_registration.update({ confirmation_image: thumbnailName.toLowerCase(), is_confirmation: 1, confirmation_date: Date(), confirmation_user_id: req.userId }, { where: { id: id } })
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

exports.Registrationbyeventanduser = (req, res) => {
    const id = req.params.id
    const userId = req.userId
    Event_registration.findAndCountAll({
        where: {
            event_id: id,
            user_id: userId
        },
        include: [
            {
                model: Event,
                as: "event",
                attributes: ["id", "title", "is_publish"]
            },
            {
                model: Exam,
                as: "exam",
                attributes: ["id", "code", "title"]
            }
        ]
    }).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving myRegistration.",
        });
    })
};