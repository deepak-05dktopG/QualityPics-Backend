const express = require("express");
const router = express.Router();
const {
  getParticularProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
} = require("../controllers/productController");

router.post("/", addProduct);
router.get("/items", getAllProducts);
router.get("/item/:id", getParticularProduct);
router.delete("/items/:id", deleteProduct);
router.put("/items/:id", updateProduct);

module.exports = router;
