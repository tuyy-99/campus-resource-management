import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import requestRoutes from "./routes/requests";
import supportRoutes from "./routes/support";
import adminRoutes from "./routes/admin";

const app = express();

connectDB()
  .then(() => {
    // Allow multiple frontend origins (comma-separated)
    const allowedOrigins = String(env.FRONTEND_ORIGIN)
      .split(",")
      .map((s) => s.trim());

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow server-to-server or same-origin requests
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }),
    );

    app.use(cookieParser());
    app.use(express.json({ limit: "500mb" }));

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/resources", resourceRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/support", supportRoutes);
    app.use("/api/admin", adminRoutes);


    // Health check
    app.get("/api/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // 404 + error handling
    app.use(notFound);
    app.use(errorHandler);

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
