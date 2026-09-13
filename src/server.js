const mongoose = require("mongoose");
const dns = require("dns");
const fs = require("fs");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/prepme";

// MongoDB connection pooling
const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const mongoDnsServers = (process.env.MONGODB_DNS_SERVERS || "1.1.1.1,8.8.8.8")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

dns.setServers(mongoDnsServers);

mongoose
  .connect(DB_URI, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });
