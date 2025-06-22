const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    replied: {
      type: Boolean,
      default: false, // 🟡 default is "not replied"
    },
    replyMessage: {
      type: String,
      default: "",
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
