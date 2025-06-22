const Product = require("../models/product");

//add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      image,
      rating,
      reviewCount,
      description,
      details,
      affiliateLink,
      affiliatefrom,
      stock,
      features,
      research,
      productimages,
    } = req.body;

    const newProduct = new Product({
      name,
      price,
      category,
      image,
      rating,
      reviewCount,
      description,
      details,
      affiliateLink,
      affiliatefrom,
      stock,
      features,
      research,
      productimages,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error while adding product" });
  }
};
//get products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error from product" });
  }
};
//get products for detailed view
const getParticularProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("GET /products/:id Error:", err.message);
    res.status(500).json({ message: "Server error while fetching product." });
  }
};

//update products
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      image,
      rating,
      reviewCount,
      description,
      details,
      affiliateLink,
      affiliatefrom,
      stock,
      features,
      research,
      productimages,
    } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        image,
        rating,
        reviewCount,
        description,
        details,
        affiliateLink,
        affiliatefrom,
        stock,
        features,
        research,
        productimages,
      },
      { new: true } // Return updated product
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete products
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
};

// const productsss = [
//   // Electronics
//   {
//     id: 1,
//     name: "Premium Wireless Headphones",
//     price: 249.99,
//     category: "electronics",
//     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format",
//     rating: 4.8,
//     reviewCount: 1254,
//     description: "Experience studio-quality sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort.",
//     details: "These headphones have been tested against 20 different models and consistently rated highest for sound quality, comfort, and battery life by expert reviewers.",
//     affiliateLink: "https://www.amazon.com/dp/B0123456789",
//     affiliatefrom: "Amazon",
//     research: [
//       "Rated #1 by Consumer Audio Magazine for noise cancellation",
//       "Over 10,000 5-star reviews on multiple platforms",
//       "Used and recommended by professional audio engineers",
//       "Features the latest Bluetooth 5.2 technology for stable connection"
//     ],
//     features: [
//       "Active Noise Cancellation",
//       "30-hour battery life",
//       "Premium memory foam ear cushions",
//       "Fast charging - 5 minutes for 3 hours of playback",
//       "Built-in high-quality microphones for calls"
//     ],
//     stock: 15,
//     productimages:["sdf","asdf"]
//   }
// ];
// Product.insertMany(productsss);

module.exports = {
  getParticularProduct,
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};
