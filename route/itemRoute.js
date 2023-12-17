const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const upload = require("../middleware/multer");
router
  .route("/")
  .get(itemController.getItems)
  .post(upload.array("images", 4), itemController.addItem)
  .put(upload.array("images", 4), itemController.editItem)
  .patch(itemController.patchItem)
  .delete(itemController.deleteItem);

module.exports = router;
