const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },

    phoneNumber: {
      type: Number,
    },

    password: {
      type: String,
    },
    confirmationCode: {
      type: Number,
    },
    confirmationCodeExpiry: {
      type: Number || String,
    },

    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "Customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    resetCode: {
      type: Number || String,
    },
    isResetCodeVerified: {
      type: Boolean,
      default: false,
    },

    resetTime: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
