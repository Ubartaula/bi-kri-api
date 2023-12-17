const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");

router
  .route("/")
  .get(commentController.getComments)
  .post(commentController.addComment)
  .put(commentController.editComment)
  .delete(commentController.deleteComment);

module.exports = router;
