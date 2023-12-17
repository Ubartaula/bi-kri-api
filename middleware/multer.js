const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "craig",
  },
});

// const storageMulter = multer.memoryStorage(); // i am opening this for mobile app
// const upload = multer({ storage: storageMulter });

const upload = multer({ dest: "uploads/" }); // closing for mobile

module.exports = upload;
