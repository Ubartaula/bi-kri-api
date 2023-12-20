require("dotenv").config();
require("express-async-errors");
const cluster = require("cluster");
const { availableParallelism } = require("os");
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  //console.log(`Primary ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    //console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const compression = require("compression");
  const express = require("express");

  const connectDB = require("./config/connectDB");
  const { default: mongoose } = require("mongoose");
  const path = require("path");
  const logger = require("./middleware/logger");
  const cors = require("cors");
  const corsOptions = require("./config/corsOption");
  const errorHandler = require("./middleware/errorHandler");
  const logEvent = require("./middleware/logEvent");
  const cookieParser = require("cookie-parser");
  const {
    cleanLogFile,
    interval,
    deleteUploads,
  } = require("./middleware/CleanRecords");

  // beginning
  const app = express();
  const PORT = process.env.PORT || 3100;
  //connect Data Base
  connectDB;
  app.use(compression());
  setInterval(cleanLogFile, interval);
  setInterval(deleteUploads, 1000 * 60 * 60 * 24);
  //logger and cors
  app.use(cors(corsOptions));
  app.use(logger);
  // middleware
  app.use(express.json());
  app.use(cookieParser());
  // Serve static files from the 'build' folder
  app.use(express.static(path.join(__dirname, "build")));

  //Set caching headers for static assets
  // app.use((req, res, next) => {
  //   res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
  //   next();
  // });

  //route
  app.use("/", require("./route/rootRoute"));
  app.use("/auth", require("./route/authRoute"));
  app.use("/items", require("./route/itemRoute"));
  app.use("/comments", require("./route/commentRoute"));
  app.use("/users", require("./route/userRoute"));

  // handling not found
  app.use("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ message: "no json data available" });
    } else {
      res.send(" no such key word match, please re type your search key word");
    }
  });

  //error handler
  app.use(errorHandler);

  mongoose.connection.once("open", () => {
    // console.log(`your app is connected to mongo data base`);
    app.listen(PORT, () => {
      //console.log(`app is running on ${PORT}`);
    });
  });

  //console.log(`Worker ${process.pid} started`);
  //catching mongo error
  mongoose.connection.on("error", (err) => {
    logEvent(
      `${new Date()} -- ${err?.no} --- ${err?.code}---${err?.syscall} ---${
        err?.hostname
      }\n`,
      "mongoErr.log"
    );
  });
}
