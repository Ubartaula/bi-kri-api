const fs = require("fs");
const path = require("path");

const cleanLogFile = async () => {
  if (fs.existsSync(path.join(__dirname, "..", "logs", "logRecord.log"))) {
    fs.writeFileSync(path.join(__dirname, "..", "logs", "logRecord.log"), "");
  }
  if (fs.existsSync(path.join(__dirname, "..", "logs", "errRecord.log"))) {
    fs.writeFileSync(path.join(__dirname, "..", "logs", "errRecord.log"), "");
  }
  if (fs.existsSync(path.join(__dirname, "..", "logs", "mongoErr.log"))) {
    fs.writeFileSync(path.join(__dirname, "..", "logs", "mongoErr.log"), "");
  }
};

const deleteUploads = async () => {
  if (fs.existsSync(path.join(__dirname, "..", "uploads"))) {
    const files = fs.readdirSync(path.join(__dirname, "..", "uploads"));
    for (const file of files) {
      const filePath = path.join(__dirname, "..", "uploads", file);
      fs.unlinkSync(filePath, (err) => {
        // remove file it self
        console.log(err);
      });
    }

    // fs.rmdirSync(path.join(__dirname, "..", "uploads")); // to delete folder it self
  }
};

const interval = 1000 * 60 * 60 * 24; // to repeat 1 day  cycle

module.exports = { cleanLogFile, deleteUploads, interval };
