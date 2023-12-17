const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
const logEvent = require("./logEvent");

const logger = (req, res, next) => {
  const data = `${new Date()}-- ${req?.method} --- ${req?.url}---${
    req?.headers?.origin
  }\n`;

  logEvent(data, "logRecord.log");

  next();
};

module.exports = logger;
