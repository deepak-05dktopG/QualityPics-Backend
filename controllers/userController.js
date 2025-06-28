const User = require("../models/User");
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
  const { name, email } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "User already exists (Already Registered)" });
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

// Login users
const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "❌ User not found ❌(Need to Register)" });
    res.status(200).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUser,getAllUsers };
