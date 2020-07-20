const multer = require("multer");

const imageFilter = (req, file, cb) => {
  const splitUrl = req.url.split("/");
  const urlPathName = splitUrl[1];
  const tipeFile = splitUrl[3];

  if (tipeFile === "thumbnail") {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  } else {
    if (!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx)$/)) {
      cb("Please upload only file with extension .pdf/.doc/.docx/.xls/.xlsx", false);
    }
    cb(undefined, true);
  }
};

/* const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file"));
    }

    cb(undefined, true);
  },
}); */

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const splitUrl = req.url.split("/");
    const urlPathName = splitUrl[1];
    const tipeFile = splitUrl[3];
    cb(null, __basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/" + splitUrl[3] + "/");
  },
  filename: (req, file, cb) => {
      //const imageName = `${Date.now()}-${file.originalname}`;
        const imageName = `${req.params.id}-${file.originalname}`;;
      cb(null, imageName.toLowerCase());
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
