require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pool = require("./config/db");
const app = express();


const {notFound, errorHandler,} = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const passageRoutes = require("./routes/passageRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminGradingRoutes = require("./routes/adminGradingRoutes");



 


// Security middleware
app.use(helmet());

// Frontend connection
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Parse JSON requests
app.use(express.json({ limit: "1mb" }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "English Mock Test API is running",
  });
});

// Health check

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/passages", passageRoutes);
app.use("/api/v1/attempts", attemptRoutes);
app.use("/api/v1/attempts", resultRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin", adminGradingRoutes);
app.get("/api/v1/db-check", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database_name"
    );

    console.log("PostgreSQL connected successfully");
    console.log("Database:", result.rows[0].database_name);

    res.status(200).json({
      success: true,
      message: "PostgreSQL connected successfully",
      database: result.rows[0].database_name,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});


app.use(notFound);
app.use(errorHandler);

module.exports = app;
