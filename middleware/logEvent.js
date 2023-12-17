const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");

const logEvent = async (data, fileName) => {
  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
  }

  try {
    await fsPromise.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      data
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvent;
