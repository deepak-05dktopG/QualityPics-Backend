const express = require("express");
const router = express.Router();
const {
  submitProductRequest,
  getAllProductRequests,
  deleteProductRequest,
  replyToProductAdded,
} = require("../controllers/requestController");

router.post("/request", submitProductRequest);
router.get("/all", getAllProductRequests); // ✅ new route
router.delete("/delete/:id", deleteProductRequest); // ✅ new route
router.put("/reply/:id", replyToProductAdded);

module.exports = router;
