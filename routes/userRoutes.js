const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
} = require("../controllers/userController");
const { adminLogin } = require("../controllers/adminController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/adminLogin", adminLogin);
router.get("/get/:id", getUser);
router.get("/getAll", getAllUsers);


module.exports = router;
