const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const media = require("../models/media");
const Media = db.media;
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
        const { page, size, title } = req.query;
        const { limit, offset } = getPagination(page, size);
        const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const findAll = await Media.findAndCountAll({
            where: condition,
            limit,
            offset,
            attributes: ["id", "title", "type", "name", "createdAt"],
            include: [{
                model: users,
                as: "created_user",
                attributes: ["id", "name"]
            }],
            order: [['id', 'DESC']]
        });
        const response = getPagingData(findAll, page, limit);
        return res.send(response);
    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
};

exports.uploadFiles = async (req, res) => {
    try {
        const splitUrl = req.url.split("/")

        if (req.file == undefined) {
            return res.send(`You must select a file`)
        }

        console.log(req.file)

        const uploaded = await Media.create({
            title: req.body.title,
            type: req.file.mimetype,
            name: req.file.filename
        });

        return res.send(`File has been uploaded.`);


    } catch (error) {
        console.log(error);
        return res.status(500).send(`Error when trying upload images: ${error}`);
    }
}



exports.deleteById = async (req, res) => {
    try {
        const id = req.params.id
        const splitUrl = req.url.split("/")
        
        const filename = await Media.findByPk(id, {
            attributes: ["name"]
        });

        if (filename) {
            const delExistingFile = fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + filename.name, () => { });
            console.log(`proses delExistingFile`)
        }

        const delMedia = Media.destroy({
            where: { id: id },
        })
        console.log(`proses delMedia`)

        return res.status(200).send(`Media was deleted successfully!`)


    } catch (error) {
        return res.status(500).send(`error occured ${error}`)
    }
};