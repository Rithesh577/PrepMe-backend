const mongoose = require("mongoose");
const dns = require("dns");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/prepme";

const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const mongoDnsServers = (process.env.MONGODB_DNS_SERVERS || "1.1.1.1,8.8.8.8")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

try {
  dns.setServers(mongoDnsServers);
} catch (e) {
  console.warn("Custom DNS servers failed, defaulting to system DNS");
}

let connPromise = null;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connPromise) {
    connPromise = mongoose.connect(DB_URI, mongoOptions);
  }
  await connPromise;
};

if (require.main === module) {
  connectDB()
    .then(() => {
      console.log("✅ MongoDB Connected");
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database Connection Error:", err.message);
    });
}

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
