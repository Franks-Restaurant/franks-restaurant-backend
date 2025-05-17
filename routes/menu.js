const express = require("express");
const MenuItem = require("../models/MenuItem");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// @POST /api/menu - Add new menu item (Auth Required)
router.post("/", authenticate, async (req, res) => {
  try {
    const itemData = req.body;

    const newItem = new MenuItem({
      ...itemData,
      createdBy: req.user.userId,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Add menu item error:", error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// @GET /api/menu - Get all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// @PUT /api/menu/:id - Update existing menu item (Auth Required)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedData = req.body;
    console.log("updatedData", updatedData);
    console.log("itemId", itemId);

    const existingItem = await MenuItem.findById(itemId);
    console.log("existingItem", existingItem);
    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Optional: Ensure only the creator or an admin can edit
    if (existingItem.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this item" });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

module.exports = router;
