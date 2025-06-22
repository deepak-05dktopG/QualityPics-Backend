const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  error: "⚠️ Too many Messages. Please try again later.",
});

const {
  saveContact,
  deleteContact,
  getContacts,
  replyToContact,
} = require("../controllers/contactController");

router.post("/post",limiter, saveContact); // Save contact message
router.get("/get", getContacts); // Get all contacts
router.delete("/delete/:id", deleteContact); // Delete by ID
router.put("/reply/:id", replyToContact); //update by id

module.exports = router;
