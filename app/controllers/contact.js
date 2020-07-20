const db = require("../models");
const fs = require("fs");
const { restart } = require("nodemon");
const Contact = db.contact;
const getPagination = require("../middlewares/getPagination");

const Op = db.Sequelize.Op;

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
}; 

exports.findAll = async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const findAll = await Contact.findAndCountAll({
            limit,
            offset,
            attributes: ["id", "name", "email", "subject", "is_read", "createdAt"],
            order: [['id', 'DESC']]
        })
        const response = getPagingData(findAll, page, limit);
        res.send(response);
    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
}

exports.create = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const subject = req.body.subject
        const message = req.body.message

        if (!name) {
            return res.status(400).send({ 
                message: `The field name is required`
            })
        }

        if (!email) {
            return res.status(400).send({ 
                message: `The field name is required` 
            })
        }

        if (!subject) {
            return res.status(400).send({ 
                message: `The field name is required` 
            })
        }

        if (!message) {
            return res.status(400).send({ 
                message: `The field name is required` 
            })
        }

        const contact = {
            name,
            email,
            subject,
            message
        }

        const createItem = await Contact.create(contact)

        res.send(createItem)

    } catch (error) {
        return res.status(500).send({
            message: `error occured ${error}`
        })
    }
};



exports.findOne = async (req, res) => {
    try {
        const id = req.params.id
        Contact.update({
            is_read: true
        }, {
            where: { id }
        }).then((num) => {
            if (num == 1) {
                Contact.findByPk(id).then((item) => {
                    if (item) {
                        return res.send(item)
                    } else {
                        return res.status(500).send({
                            message: `not found contact with id ${id}`
                            
                        })
                    }
                })
            } else {
                return res.status(500).send({
                    message: "update is_read failed"
                })
            }
        }).catch((err) => {
            return res.status(500).send({
                message: `contact id is not found!`
            })
        })
    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
}

exports.deleteByIds = async (req, res) => {
    try {
        const id = req.query.id
        
        await Contact.destroy({
            where: {
                id: {
                    [Op.in]: id
                }
            }
        }).then((items) => {
            res.send(`success delete id in ${id}`)
        }).catch((error) => {
            return res.status(500).send(`error occured ${error}`)
        }) 
    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
        
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        await Contact.destroy({
            where: { id: id },
        }).then((item) => {
            res.send(`success delete id = ${id}`)
        }).catch((error) => {
            return res.status(500).send(`error occured ${error}`)
        }) 
    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
        
    

}