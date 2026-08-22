import express from "express";
import cors from "cors";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import peerLearningRoutes from "./routes/peerLearningRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import studyMaterialRoutes from "./routes/studyMaterialRoutes.js";

const app = express();

// CORS
// In production, set ALLOWED_ORIGINS to a comma-separated list of your
// deployed frontend URLs (e.g. https://campusconnect.onrender.com,https://campusconnect-admin.onrender.com)
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:8080",
  "http://localhost:8081",
];
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];
const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/peer-learning", peerLearningRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/study-materials", studyMaterialRoutes);

// TEST ROUTES
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

export default app;