const db = require("../models");
const News_category = db.news_category;

const Op = db.Sequelize.Op;

// Create and Save a new News_category
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title can not be empty!",
    });
    return;
  }

  // Create a news_category
  const news_category = {
    title: req.body.title,
    created_user_id: req.userId
  };

  // Save news_category in the database
  News_category.create(news_category)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while creating the News_category.",
      });
    });
};

// Update and save an news_category
exports.update = (req, res) => {
  const id = req.params.id;

  News_category.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "News_category was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update News_category with id=${id}. Maybe News_category was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating News_category with id=" + id,
      });
    });
};

// Read news_category by id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  News_category.findByPk(id, {
    attributes: ["id", "title"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving News_category with id=" + id,
      });
    });
};

// Read all news_categorys
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  News_category.findAll({
    where: condition,
    attributes: ["id", "title"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving news_categorys.",
      });
    });
};

// Delete news_category by id
exports.delete = (req, res) => {
  const id = req.params.id;

  News_category.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "News_category was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete News_category with id=${id}. Maybe News_category was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete News_category with id=" + id,
      });
    });
};
