import express from "express";
import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "../Controllers/contactMessageController.js";

const router = express.Router();

// Public
router.post("/", createContactMessage);

// Admin
router.get("/", verifyToken, requireAdmin, getContactMessages);
router.patch(
  "/:id/status",
  verifyToken,
  requireAdmin,
  updateContactMessageStatus,
);

export default router;
