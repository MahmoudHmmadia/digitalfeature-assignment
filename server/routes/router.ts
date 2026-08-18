import { Express } from "express";

export default function router(server: Express) {
  server.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Add your routes here
  // Example: server.use("/api/users", userRoutes);
}
