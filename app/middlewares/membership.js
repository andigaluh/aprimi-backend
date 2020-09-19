const multer = require("multer");

const imageFilter = (req, file, cb) => {
    const splitUrl = req.url.split("/");
    const urlPathName = splitUrl[1];

    if (!file.originalname.match(/\.(pdf|png|jpg|jpeg|gif|zip|rar)$/)) {
        return cb(new Error("Please upload only file with extension pdf|png|jpg|jpeg|gif|zip|rar"), false);
    }

    cb(undefined, true);
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const splitUrl = req.url.split("/");
        const urlPathName = splitUrl[1];
        cb(null, __basedir + "/resources/static/assets/uploads/membership/");
    },
    filename: (req, file, cb) => {
        const imageName = `${file.originalname}`;
        cb(null, imageName.toLowerCase());
    },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
