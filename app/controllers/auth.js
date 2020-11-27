const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mailsender = require("../middlewares/mailsender");
const configMail = require("../config/mail.config");
const encDec = require("../middlewares/encDec")

exports.signup = (req, res) => {

  // Save User to Database

  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return
  }

  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!"
    });
    return;
  }

  if (!req.body.password) {
    res.status(400).send({
      message: "Password can not be empty!",
    });
    return;
  }

  if (!req.body.title) {
    res.status(400).send({
      message: "Title / Position can not be empty!",
    });
    return;
  }

  if (!req.body.phone) {
    res.status(400).send({
      message: "Mobile / Phone can not be empty!",
    });
    return;
  }

  User.create({
    name: req.body.name,
    email: req.body.email,
    title: req.body.title,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
    status: req.body.status,
    company_id: req.body.company_id
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: configMail.userRegistrationSuccessText });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({
            message: configMail.userRegistrationSuccessText,
          });
        });
      }

      let encryptedId = encDec.encryptedString(user.id);
      let urlActivation = config.URL + "/users/activate/" + encryptedId;

      let textMsg = configMail.userRegistrationText.replace("{req.body.name}", req.body.name).replace("{req.body.email}", req.body.email).replace("{req.body.password}", req.body.password).replace("{urlActivation}", urlActivation);
      
      let htmlMsg = configMail.userRegistrationHTML.replace("{req.body.name}", req.body.name).replace("{req.body.email}", req.body.email).replace("{req.body.password}", req.body.password).replace("{urlActivation}", urlActivation).replace("{urlActivationText}", urlActivation);

      mailsender({
        to: req.body.email,
        subject: configMail.userRegistrationSubject,
        text: textMsg,
        html: htmlMsg,
      });

    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    }); 


};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.status === false) {
        return res.status(404).send({ message: "User not active" })
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
                  
        User.update({ accesstoken: token, last_signin: Date() }, { where: { id: user.id }}).then((num) => {
          console.log('update accessToken : ' + num);
        })

        res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          title: user.title,
          phone: user.phone,
          roles: authorities,
          accessToken: token,
          last_signin: Date()
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
