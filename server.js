const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,   // e.g., "http://localhost:5173"
    credentials: true,                  // allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL Connected");
  } catch (err) {
    console.log("❌ DB Error:", err.message);
  }
})();
//Middleware for login and signups
const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);

//Middleware for all protected Routes
const protectedRoutes = require("./Routes/protectedRoutes");
app.use("/api", protectedRoutes);

app.get("/", (req, res) => res.send("Backend is running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));