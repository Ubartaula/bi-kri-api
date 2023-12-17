const monggose = require("mongoose");

const connectDB = monggose.connect(process.env.DATABASE_URI);

module.exports = connectDB;
