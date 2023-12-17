const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_name,
  api_key: process.env.CLOUD_api_key,
  api_secret: process.env.CLOUD_api_secret,
});

module.exports = cloudinary;
