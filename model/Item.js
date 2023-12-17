const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    province: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },

    itemInfo: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);

// the text field is to communicate between supplier and buyer,
// it has to be handled as same as you post comments on item on your amazone clone project
// once you put your text here the supplier will be notified
