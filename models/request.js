const mongoose = require("mongoose");

const requestProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    productType: { type: String },
    description: { type: String },
    urgency: { type: String, default: "normal" },
    preferredBrands: { type: String },
    priceRange: { type: String },
    additionalInfo: { type: String },
    replied: {
      type: Boolean,
      default: false, //  default is "not replied"
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("RequestProduct", requestProductSchema);
