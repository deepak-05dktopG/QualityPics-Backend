const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

// Route to add product to cart
router.post("/add", cartController.addToCart);

// Route to get user's cart items
router.get("/:userId", cartController.getCart);

// Route to remove product from cart
router.post("/remove", cartController.removeFromCart);

module.exports = router;
