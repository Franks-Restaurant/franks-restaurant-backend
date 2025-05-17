require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const offerRoutes = require("./routes/offer");
const publicMenuRoutes = require("./routes/publicMenu");
const publicOfferRoutes = require("./routes/publicOffers");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

console.log("server Called properly");

app.use("/", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/public/menu", publicMenuRoutes);
app.use("/api/public/offers", publicOfferRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));