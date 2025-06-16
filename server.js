const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const clientRoutes = require('./routes/clientRoutes');
app.use('/api/clients', clientRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);


// Rute
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api", dashboardRoutes);

const exportRoutes = require("./routes/exportRoutes");
app.use("/api/export", exportRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);





mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Serverul rulează pe http://localhost:5000");
    });
  })
  .catch((err) => console.error("MongoDB error:", err));
