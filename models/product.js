const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  image: String,
  rating: Number,
  reviewCount: Number,
  description: String,
  details: String,
  affiliateLink: String,
  affiliatefrom: String,
  research: [String],
  features: [String],
  productimages: [String],
  stock: Number,
});

module.exports = mongoose.model("Product", productSchema);
