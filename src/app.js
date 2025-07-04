const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const logger = require("./utils/logger");
const { connectDB } = require("./utils/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const likeRoute = require("./routes/likes");
const commentRoute = require("./routes/comments");

/**
 * Express application setup and configuration
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoute);
app.use("/api/comments", commentRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/",(req,res) => {
	res.json("HLO WORLD");
})

// Global error handler
app.use((err, req, res, next) => {
  logger.critical("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * Start the server
 */
const startServer = async () => {
  try {
    console.log("[INIT] Starting server...");
    await connectDB();
    console.log("[INIT] Database connected ✅");

    app.listen(PORT, () => {
      console.log(`[SERVER] Listening on port ${PORT}`);
    });

    require("../scripts/scheduler");
    console.log("[SCHEDULER] Started");
  } catch (error) {
    console.error("[FATAL] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
