const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");

//getAlluser
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
function generateEmailHTML(message) {
  return `
   <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
  <h2 style="color: #083f90;">Hey there 👋</h2>

  <p>We’ve done the research so you don’t have to! 🕵️‍♀️</p>
  <p>Discover top-rated products across fashion, gadgets, home essentials, and more — all handpicked for quality and value! 💡</p>

  <!-- Insert your dynamic message below -->
  <div style="background-color: #e6f0ff; border-left: 4px solid #083f90; padding: 15px; margin: 20px 0; border-radius: 5px;">
    <p style="margin: 0; font-weight: bold;">✨ Special Message Just for You:</p>
    <p style="margin-top: 8px;">${message}</p>
  </div>

  <a href="https://qualitypicks.vercel.app/products/all" style="display: inline-block; background-color: #083f90; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px;">
    🔍 Browse Picks Now
  </a>

  <p style="margin-top: 20px;">Got something in mind? <a href="https://qualitypicks.vercel.app/request-product" style="color: #083f90;">Request a product</a> and we’ll find it for you! 😍</p>

  <p style="margin-top: 30px; font-size: 0.9em;">With ❤️ from <strong>QualityPicks Team</strong> at <strong>QualityPicks</strong></p>
</div>

  `;
}
//sendBulkEmail
const sendBulkEmail = async (req, res) => {
  const { subject, message } = req.body;
  const users = await User.find({}, "email");

  const promises = users.map((user) =>
    sendEmail(user.email, subject, generateEmailHTML(message))
  );

  await Promise.all(promises);
  res.json({ success: true });
};

//get user
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const name = req.body?.name || req.query?.name;
  const email = req.body?.email || req.query?.email;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User alread y exists  (Already Registered)" });


    const newUser = await User.create({ name, email });
    await sendEmail(
      email,
      "🎉 Welcome to QualityPicks – Your Shortcut to Smart Shopping!",
      `
    <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; max-width:600px; margin:auto; padding:24px; background:#fff; border-radius:12px; border:1px solid #e0e0e0; box-shadow:0 2px 8px rgba(44,123,229,0.07);">
      <div style="text-align:center; margin-bottom:20px;">
        <h2 style="color:#2C7BE5; font-size:20px; margin:0 0 8px 0;">👋 Hi ${name}, welcome to <span style="color:#1A73E8;">QualityPicks</span>!</h2>
      </div>
      <p style="font-size:16px; color:#333; margin-bottom:16px; text-align:center;">
        Thank you for signing up with <strong>QualityPicks</strong> — the platform built to help you <strong>discover the best, research-backed products</strong> without the overwhelming search.
      </p>
      <div style="background:#E8F0FE; padding:16px; border-radius:8px; margin:24px 0 18px 0; border-left:4px solid #2C7BE5;">
        <p style="margin:0; font-size:15px; color:#1A73E8; text-align:justify;">
          🔍 Why waste hours comparing products? At QualityPicks, we’ve already done the deep research for you.
        </p>
      </div>

      <p style="font-size:15px; color:#555; margin-bottom:12px; text-align:center;">
        From electronics to everyday essentials, each product you see on our platform is carefully selected based on performance, reviews, and value for money.
      </p>
      <p style="font-size:15px; color:#555; margin-bottom:18px; text-align:center;">
        Start exploring now and make confident purchase decisions with ease.
      </p>
      <div style="text-align:center; margin-top:28px;">
        <a href="https://qualitypicks.vercel.app/" style="background:#2C7BE5; color:#fff; padding:12px 28px; text-decoration:none; border-radius:7px; font-size:16px; font-weight:600; box-shadow:0 2px 6px rgba(44,123,229,0.12); display:inline-block;">
          🔗 Visit QualityPicks
        </a>
      </div>
      <p style="font-size:15px; color:#555; margin-top:36px; margin-bottom:6px;">
        We're excited to help you shop smarter,
      </p>
      <p style="font-weight:bold; color:#2C7BE5; margin:0;">– Team QualityPicks</p>
      <hr style="margin:32px 0 18px 0; border:none; border-top:1px solid #eee;" />
      <div style="font-size:12px; color:#999; text-align:center;">
        You're receiving this email because you registered at QualityPicks.<br/>
      </div>
    </div>

      `
    );
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Verify user email
const verifyUserEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).send("User not found.");
    if (user.isVerified) return res.send("Email already verified.");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("🎉 Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(400).send("❌ Invalid or expired token.");
  }
};

// Login users
const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "❌ User not found ❌(Need to Register)" });
    // if (!user.isVerified)
    //   return res.status(403).send("Please verify your email first!");

    res.status(200).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  sendBulkEmail,
  deleteUser,
  verifyUserEmail,
};
