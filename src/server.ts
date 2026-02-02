import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/database";
import { errorHandler, notFound } from "./middleware/error";

import authRoutes from "./routes/authRoutes";
import bagRoutes from "./routes/bagRoutes";
import userRoutes from "./routes/userRoutes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bags", bagRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server with PORT parsing and EADDRINUSE fallback
const DEFAULT_PORT = parseInt(process.env.PORT ?? "5000", 10);

async function safeStart(port: number) {
  return new Promise<any>((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on("error", (err: any) => reject(err));
  });
}

(async () => {
  try {
    // ensure DB is connected before starting server
    await connectDB();
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }

  try {
    const server = await safeStart(DEFAULT_PORT);
    const actualPort = (server.address() as any)?.port ?? DEFAULT_PORT;
    console.log(`Server running on port ${actualPort}`);
  } catch (err: any) {
    if (err?.code === "EADDRINUSE") {
      console.warn(`Port ${DEFAULT_PORT} already in use. Trying an ephemeral port...`);
      try {
        const server = await safeStart(0); // let OS pick a free port
        const actualPort = (server.address() as any)?.port;
        console.log(`Server running on ephemeral port ${actualPort}`);
      } catch (err2) {
        console.error("Failed to start server on an ephemeral port:", err2);
        process.exit(1);
      }
    } else {
      console.error("Server failed to start:", err);
      process.exit(1);
    }
  }
})();

export default app;