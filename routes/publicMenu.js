const express = require("express");
const MenuItem = require("../models/MenuItem");

const router = express.Router();

// Utility: Group items by session
function groupBySession(items) {
  return items.reduce((grouped, item) => {
    const session = item.session || "other";
    if (!grouped[session]) {
      grouped[session] = [];
    }

    grouped[session].push({
      id: item._id,
      name: item.name,
      description: item.description,
      price: `$${item.price.toFixed(2)}`,
      image: item.image,
      dietary: item.dietary || []
    });

    return grouped;
  }, {});
}

// Public GET: All menu items, grouped by session
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    const grouped = groupBySession(items);
    res.json(grouped);
  } catch (error) {
    console.error("Public menu fetch error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

module.exports = router;
