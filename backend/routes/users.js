const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();
const { registerUser , loginUser,deleteUser,findUserById} = require("../controllers/usersController");
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id",auth,findUserById);
router.post("/register", registerUser);
router.post("/login",loginUser);
router.delete("/:userId",auth,deleteUser);
module.exports = router;
