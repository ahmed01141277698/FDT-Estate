import express from "express";

import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";

import {
  getPublishedArticles,
  getPublishedCategories,
  getArticle,
  createArticle,
  updateArticle,
  archiveArticle,
} from "../Controllers/articleController.js";

const router = express.Router();

// Public
router.get("/", getPublishedArticles);
router.get("/categories", getPublishedCategories);
router.get("/:slug", getArticle);

// Admin
router.post("/", verifyToken, requireAdmin, createArticle);
router.patch("/:id", verifyToken, requireAdmin, updateArticle);
router.delete("/:id", verifyToken, requireAdmin, archiveArticle);

export default router;
