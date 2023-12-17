const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router
  .route("/")
  .get(userController.getUsers)
  .post(userController.addUser)
  .put(userController.editUser)
  .patch(userController.sendOTP)
  .delete(userController.deleteUser);

router.route("/confirm-email").post(userController.confirmEmail);
router.route("/confirm-otp").post(userController.confirmOTP);
router.route("/reset").post(userController.passwordReset);

module.exports = router;
