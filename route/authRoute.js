const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.route("/").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/refresh").get(authController.refresh);

module.exports = router;
