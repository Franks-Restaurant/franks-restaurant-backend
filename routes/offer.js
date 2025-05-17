const express = require("express");
const Offer = require("../models/Offer");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Add Offer
router.post("/", authenticate, async (req, res) => {
  try {
    const offerData = req.body;
    const newOffer = new Offer({
      ...offerData,
      createdBy: req.user.userId,
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Add offer error:", error);
    res.status(500).json({ error: "Failed to add offer" });
  }
});

// Get All Offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// Update Offer
router.put("/:id", authenticate, async (req, res) => {
  try {
    const offerId = req.params.id;
    const updatedData = req.body;

    const existingOffer = await Offer.findById(offerId);
    if (!existingOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (existingOffer.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this offer" });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, updatedData, {
      new: true,
    });

    res.json(updatedOffer);
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(500).json({ error: "Failed to update offer" });
  }
});

module.exports = router;
