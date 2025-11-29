const Admin = require("../models/adminlogin");
const bycrpt = require("bcrypt");

// Admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({
        message:
          "🚫 Access Denied: Authorized QualityPics Administrators Only 🙅‍♂️🔒",
      });
    // Compare the provided password with the hashed password in the database
    const isValid = await bycrpt.compare(password, admin.password);
    if (!isValid)
      return res.status(401).json({ message: "❌ Invalid password ❌" });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json("ooo+", { message: err.message });
  }
};

// const newAdmin = new Admin({
//   email: 'srinnethi.rd@gmail.com',
//   password: 'Srinnethi' // this will be hashed before save
// });

// newAdmin.save(); // Password gets hashed here

module.exports = { adminLogin };
