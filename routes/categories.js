const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  deleteCategories,
  updateCategories,
} = require("../controllers/categoryController.js");

router.post("/", addCategory);
router.get("/category", getCategories);
router.delete("/category/:id", deleteCategories);
router.put("/category/:id", updateCategories);

module.exports = router;
