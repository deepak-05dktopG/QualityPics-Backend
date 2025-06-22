const Category = require("../models/category");
//add new category
exports.addCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const category = new Category({
      name,
      image,
      description,
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Server error while creating category" });
  }
};

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error from category" });
  }
};

//Delete categories
exports.deleteCategories = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, description },
      { new: true } // Return updated document
    );
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// const sampleCategories = [
//   {
//     id: 'electronics',
//     name: 'Electronics',
//     image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format',
//     description: 'Thoroughly researched gadgets and devices'
//   },
//   {
//     id: 'home-kitchen',
//     name: 'Home-Kitchen',
//     image: 'https://th.bing.com/th/id/OIP.SD715J1NVQ7Cu7fWGk0xFQHaE7?rs=1&pid=ImgDetMain',
//     description: 'Quality appliances and home essentials'
//   },
//   {
//     id: 'fashion',
//     name: 'Fashion',
//     image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format',
//     description: 'Durable and stylish clothing and accessories'
//   },
//   {
//     id: 'beauty',
//     name: 'Beauty',
//     image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format',
//     description: 'Effective skincare and beauty products'
//   },
//   {
//     id: 'books',
//     name: 'Books',
//     image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format',
//     description: 'Life-changing books worth your time'
//   }
// ];

//  Category.insertMany(sampleCategories)
