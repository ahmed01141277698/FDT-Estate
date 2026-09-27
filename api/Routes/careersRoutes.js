import express from "express";
import multer from "multer";

import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";

import { simpleRateLimiter } from "../Middleware/simpleRateLimiter.js";

import {
  getPublishedJobs,
  getJob,
  createJob,
  updateJob,
  archiveJob,
  getJobApplications,
  applyForJob,
  updateApplicationStatus,
} from "../Controllers/jobController.js";

const router = express.Router();

const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// Public
router.get("/", getPublishedJobs);
router.get("/:slug", getJob);

// Admin
router.post("/", verifyToken, requireAdmin, createJob);
router.patch("/:id", verifyToken, requireAdmin, updateJob);
router.delete("/:id", verifyToken, requireAdmin, archiveJob);
router.get("/:id/applications", verifyToken, requireAdmin, getJobApplications);

// Public application
router.post(
  "/:slug/apply",
  simpleRateLimiter({
    windowMs: 60 * 1000,
    max: 3,
    message: "الكثير من الطلبات، حاول مرة أخرى بعد دقيقة.",
  }),
  uploadCv.single("cv"),
  applyForJob,
);

// Admin application status
router.patch(
  "/:id/application-status",
  verifyToken,
  requireAdmin,
  updateApplicationStatus,
);

export default router;
