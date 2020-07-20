const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.static("resources/static/assets/"));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

const initRoutes = require("./app/routes/web");

global.__basedir = __dirname;

initRoutes(app);

db.sequelize.sync();

/* db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
}); */


function initial() {
  const Role = db.role;
  const Company = db.company;
  const User = db.users;
  const Event_category = db.event_category;
  const Exam = db.exam;

  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "komite",
  });

  Role.create({
    id: 4,
    name: "admin",
  });

  Company.create({
    id: 1,
    name: "Aprimi",
    address: "-",
    phone: "021123123",
    fax: "021123123",
    contact_person_name: "Annalia Budi",
    contact_person_title: "Secretary",
    contact_person_phone: "08123123123",
    contact_person_email: "annalia.db@aprimi.org",
    authorized_name: "Adityo Nugroho",
    authorized_title: "CEO",
    is_active: true,
    created_user_id: 1
  }); 

  Event_category.create({
    id: 1,
    title: "Pendaftaran APRIMI 2020"
  })

  Exam.create({
    code: "T1/GR1",
    title: "T1/GR1 – Total Reward Management"
  })

  Exam.create({
    code: "T3/GR2",
    title: "T3/GR2 – Quantitative Methods"
  })

  Exam.create({
    code: "T4/GR9",
    title: "T4/GR9 – Strategic Communication in Total Rewards"
  })

  Exam.create({
    code: "C2/GR3",
    title: "C2/GR3 – Job Analysis, Documentation and Evaluation"
  })

  Exam.create({
    code: "C4/GR4",
    title: "C4/GR4 – Base Pay Administration and Pay for Performance"
  })

  Exam.create({
    code: "C12/GR6",
    title: "C12/GR6 – Variable Pay"
  })

  Exam.create({
    code: "C17/GR17",
    title: "C17/GR17 – Market Pricing"
  })

  Exam.create({
    code: "C8",
    title: "C8 – Business Acumen for Compensation Professional"
  })

  Exam.create({
    code: "T7",
    title: "T7 – International Financial Reporting Standard for Compensation Professional"
  })

  Exam.create({
    code: "T2",
    title: "T2 – Accounting and Finance for Human Resources Professional"
  })

  Exam.create({
    code: "C1",
    title: "C1 – Regulatory Environment for Compensation Programs"
  })
  
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to aprimi-rest-api application." });
});

//require("./app/routes/tutorial.routes")(app);
require("./app/routes/user")(app);
require("./app/routes/auth")(app);
require("./app/routes/news_category")(app);
require("./app/routes/admin")(app);
require("./app/routes/event")(app);
require("./app/routes/company")(app);
require("./app/routes/contact")(app);
require("./app/routes/carousel")(app);
require("./app/routes/content")(app);
require("./app/routes/news")(app);
require("./app/routes/logo")(app);
require("./app/routes/role")(app);
require("./app/routes/about")(app);
require("./app/routes/whatwedo")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});