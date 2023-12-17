const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
const logEvent = require("./logEvent");

const errorHandler = async (err, req, res, next) => {
  const data = `${new Date()} --${err?.name} ${err?.message}---${
    req?.method
  }---${req?.headers?.origin}\n`;

  logEvent(data, "errRecord.log");

  const status = res?.statusCode ? res?.statusCode : 500;
  res.status(status);
  res.json({ message: err?.message, isError: true });
};

module.exports = errorHandler;
