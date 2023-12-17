const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);

// the text field is to communicate between supplier and buyer,
// it has to be handled as same as you post comments on item on your amazone clone project
// once you put your text here the supplier will be notified
