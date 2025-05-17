// routes/auth.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * Accepts user info from Google SSO and registers or logs in.
 */
router.post("/api/auth/google-login", async (req, res) => {
  console.log("calledd...login.....", req.body);
  const { name, email, profilePic } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    let user = await User.findOne({ email });

    console.log("user", user);
    if (!user) {
      user = new User({
        name,
        email,
        profilePic,
        role: "user",
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("token", token);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
