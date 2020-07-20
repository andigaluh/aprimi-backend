const db = require("../models");
const fs = require("fs");
const { users } = require("../models");
const News = db.news;
const News_category = db.news_category;
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

    News.findAndCountAll({
        where: condition,
        limit,
        offset,
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: News_category,
            as: "news_category",
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
                message: err.message || "Some error occurred while retrieving newss.",
            });
        });
};

// Read all newss
exports.findAllFeatured = (req, res) => {
    News.findAll({
        where: {is_publish: 1, is_featured: 1},
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: News_category,
            as: "news_category",
            attributes: ["id", "title"]
        }, {
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

// Read all newss
exports.findAllPublished = (req, res) => {
    News.findAll({
        where: {is_publish: 1},
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: News_category,
            as: "news_category",
            attributes: ["id", "title"]
        }, {
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

// Create and Save a new News
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!",
        });
        return;
    }

    // Create a news
    const news = {
        title: req.body.title,
        headline: req.body.headline,
        content: req.body.content,
        news_category_id: req.body.news_category_id,
        created_user_id: req.userId,
        status: req.body.status,
        company_id: req.body.company_id
    };

    // Save news in the database
    News.create(news)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the News.",
            });
        });
};

// Update and save an news
exports.update = (req, res) => {
    const id = req.params.id;

    News.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "News was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error updating News with id=" + id,
            });
        });
};

// Read news by id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    News.findByPk(id, {
        attributes: ["id", "title", "headline", "content", "is_publish", "is_featured", "createdAt"],
        include: [{
            model: News_category,
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
                message: "Error retrieving News with id=" + id,
            });
        });
};

// Delete news by id
exports.delete = (req, res) => {
    const id = req.params.id;

    News.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "News was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete News with id=${id}. Maybe News was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete News with id=" + id,
            });
        });
};

exports.thumbnail = (req, res) => {
    try 
    {
        console.log(req.file);
        const id = req.params.id;
        const splitUrl = req.url.split("/")
        

        if (req.file == undefined) {
        return res.send(`You must select a file.`);
        }

        News.findByPk(id, { attributes: ["thumbnail"]}).then((result) => {

            if (result) {
                fs.unlink(__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + splitUrl[3] + "/" + result.thumbnail, () => {});
            } 

            //const thumbnailName = `${Date.now()}-${req.file.originalname}`;
            const thumbnailName = `${id}-${req.file.originalname}`;
            News.update({ thumbnail: thumbnailName.toLowerCase()}, { where: { id: id } })
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

// Activate / non-activate news by id
exports.activate = (req, res) => {
    const id = req.params.id;
    const status = (req.params.status == "true") ? 1 : 0;
    

    News.update({
        is_publish: status
    }, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                if (status == 1) {
                    res.send({
                        message: "News was active.",
                    });
                } else {
                    res.send({
                        message: "News was non-active.",
                    });
                }
            } else {
                res.send({
                    message: `Cannot activate/non-activate News with id=${id}. Maybe News was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(400).send({
                message: "Error activating News with id=" + id,
            });
        });
}

