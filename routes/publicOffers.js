const express = require("express");
const Offer = require("../models/Offer");

const router = express.Router();

// Public GET: All offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error("Public offer fetch error:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

module.exports = router;
