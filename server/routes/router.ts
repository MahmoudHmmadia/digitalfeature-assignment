import { Express, Request, Response } from "express";
import { API_PREFIX } from "../config/swagger.config";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";
import feedbackRequestRoutes from "./feedback-request.routes";
import verifyToken, { verifyAdmin } from "@/middleware/verifyToken.middleware";
import commentRoutes from "./comment.routes";
import voteRoutes from "./vote.routes";
import categoryRoutes from "./category.routes";
import adminRoutes from "./admin.routes";

function health(_req: Request, res: Response) {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
}

export default function router(server: Express) {
  server.get("/health", health);
  server.get(`${API_PREFIX}/health`, health);

  server.use(`${API_PREFIX}/auth`, authRoutes);
  server.use(`${API_PREFIX}/accounts`, verifyToken, accountRoutes);
  server.use(
    `${API_PREFIX}/feedback-requests`,
    verifyToken,
    feedbackRequestRoutes,
  );
  server.use(`${API_PREFIX}/comments`, verifyToken, commentRoutes);
  server.use(`${API_PREFIX}/votes`, verifyToken, voteRoutes);
  server.use(`${API_PREFIX}/categories`, verifyToken, categoryRoutes);
  server.use(`${API_PREFIX}/admin`, verifyToken, verifyAdmin, adminRoutes);
}
