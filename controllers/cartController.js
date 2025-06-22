const Cart = require("../models/cart"); // Import Cart model

// Add a product to the user's cart
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body; // Destructure userId and productId from request
  try {
    // Find existing cart and add product to it. If cart doesn't exist, create one.
    const cart = await Cart.findOneAndUpdate(
      { user: userId }, // Find cart by user ID
      { $addToSet: { items: productId } }, // Add product ID to 'items' array (avoids duplicates)
      { new: true, upsert: true } // Return updated doc; create if doesn't exist
    );
    res.status(200).json(cart); // Send updated cart as response
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error }); // Handle error
  }
};

// Get all products from a user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "items"
    ); // Replace product IDs with full product info
    res.status(200).json(cart?.items || []); // Return array of items or empty array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error }); // Error handling
  }
};

// Remove a product from the user's cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.toString() !== productId);
    await cart.save();
    alert("removed");
    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    alert("removed error");
    res.status(500).json({ message: "Server error" });
  }
};
