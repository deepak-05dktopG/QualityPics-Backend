const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userController");
const { adminLogin } = require("../controllers/adminController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/adminLogin", adminLogin);
router.get("/get/:id", getUser);

module.exports = router;
