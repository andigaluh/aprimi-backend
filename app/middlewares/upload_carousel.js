const multer = require("multer");

const imageFilter = (req, file, cb) => {
    const splitUrl = req.url.split("/");
    const urlPathName = splitUrl[1];

    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
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
        cb(null, __basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/");
    },
    filename: (req, file, cb) => {
        const imageName = `${file.originalname}`;;
        cb(null, imageName.toLowerCase());
    },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
