const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const Event_registration = db.event_registration;
const Exam = db.exam;
const Event = db.event;

const Op = db.Sequelize.Op;

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
    Event_registration.create(registration)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Registration.",
            });
        });
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
        ]
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

// Update and save an event registration
/* exports.update = (req, res) => {
    const id = req.params.id;

    Event_reg.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Event_reg was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Event_reg with id=${id}. Maybe Event_reg was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating Event_reg with id=" + id,
            });
        });
}; */

// Read event registration by id
/* exports.findOne = async (req, res) => {
    const id = req.params.id;

    Event_reg.findByPk(id, {
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: Event_reg_category,
            as: "news_category",
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
                message: "Error retrieving Event_reg with id=" + id,
            });
        });
}; */

// Read all event registration
/* exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Event_reg.findAll({
        where: condition,
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: Event_reg_category,
            as: "news_category",
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
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving event registration.",
            });
        });
}; */

// Delete event registration by id
/* exports.delete = (req, res) => {
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
}; */

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