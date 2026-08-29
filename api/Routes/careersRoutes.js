import express from "express";
import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";
import { simpleRateLimiter } from "../Middleware/simpleRateLimiter.js";
import { apiResponse } from "../utils/response.js";
import {
  createJobFromPayload,
  updateJobById,
  listPublishedJobs,
  getJobBySlug,
  createApplication,
  getJobApplicationsByJobId,
} from "../Services/adminContentService.js";
import {
  isValidObjectId,
  normalizeSlug,
  sanitizeText,
} from "../utils/validators.js";
import Job from "../Models/jobModel.js";
import JobApplication from "../Models/jobApplicationModel.js";
import multer from "multer";
import StorageService from "../Services/storageService.js";

const router = express.Router();
const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.get("/", async (req, res, next) => {
  try {
    const {
      page,
      limit,
      search,
      department,
      location,
      employmentType,
      experienceLevel,
    } = req.query;
    const result = await listPublishedJobs({
      page,
      limit,
      search,
      department,
      location,
      employmentType,
      experienceLevel,
    });

    return apiResponse({
      res,
      status: 200,
      data: result,
      message: "Jobs retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const job = await getJobBySlug(req.params.slug);
    if (!job) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "JOB_NOT_FOUND",
        message: "Job not found",
      });
    }

    return apiResponse({
      res,
      status: 200,
      data: { job },
      message: "Job retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      title: sanitizeText(req.body.title),
      slug: normalizeSlug(req.body.slug || req.body.title),
    };

    const job = await createJobFromPayload(payload, req.userId);
    return apiResponse({
      res,
      status: 201,
      data: { job },
      message: "Job created successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const job = await updateJobById(req.params.id, req.body, req.userId);
    if (!job) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "JOB_NOT_FOUND",
        message: "Job not found",
      });
    }

    return apiResponse({
      res,
      status: 200,
      data: { job },
      message: "Job updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "JOB_NOT_FOUND",
        message: "Job not found",
      });
    }

    job.deletedAt = new Date();
    await job.save();

    return apiResponse({
      res,
      status: 200,
      message: "Job archived successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/applications",
  verifyToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const applications = await getJobApplicationsByJobId(req.params.id);
      return apiResponse({
        res,
        status: 200,
        data: { applications },
        message: "Applications retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:slug/apply",
  simpleRateLimiter({
    windowMs: 60 * 1000,
    max: 3,
    message: "الكثير من الطلبات، حاول مرة أخرى بعد دقيقة.",
  }),
  uploadCv.single("cv"),
  async (req, res, next) => {
    try {
      const job = await Job.findOne({
        slug: req.params.slug,
        status: "published",
        deletedAt: null,
      });
      if (!job) {
        return apiResponse({
          res,
          status: 404,
          success: false,
          code: "JOB_NOT_FOUND",
          message: "Job not found",
        });
      }

      if (!req.file) {
        return apiResponse({
          res,
          status: 400,
          success: false,
          code: "CV_REQUIRED",
          message: "CV file is required",
        });
      }

      const allowedMimeTypes = ["application/pdf"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return apiResponse({
          res,
          status: 400,
          success: false,
          code: "INVALID_FILE_TYPE",
          message: "Only PDF files are allowed",
        });
      }

      if (req.file.size > 2 * 1024 * 1024) {
        return apiResponse({
          res,
          status: 400,
          success: false,
          code: "FILE_TOO_LARGE",
          message: "CV size must not exceed 2MB",
        });
      }

      const storageMeta = await StorageService.uploadFile(req.file, {
        folder: "aqarx/careers",
        allowedMimeTypes,
        maxSizeBytes: 2 * 1024 * 1024,
      });

      const application = await createApplication(job._id, {
        applicantName: req.body.applicantName,
        email: req.body.email,
        phone: req.body.phone,
        linkedInUrl: req.body.linkedInUrl,
        portfolioUrl: req.body.portfolioUrl,
        coverLetter: req.body.coverLetter,
        cv: {
          ...storageMeta,
          url: storageMeta.url || `/uploads/cv/${req.file.originalname}`,
          storageProvider: "local",
        },
        source: "career_page",
      });

      return apiResponse({
        res,
        status: 201,
        data: { application },
        message: "Application submitted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id/application-status",
  verifyToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        return apiResponse({
          res,
          status: 400,
          success: false,
          code: "INVALID_ID",
          message: "Invalid application id",
        });
      }

      const application = await JobApplication.findById(req.params.id);
      if (!application) {
        return apiResponse({
          res,
          status: 404,
          success: false,
          code: "APPLICATION_NOT_FOUND",
          message: "Application not found",
        });
      }

      const nextStatus = req.body.status;
      application.status = nextStatus;
      application.statusHistory.push({
        status: nextStatus,
        changedBy: req.userId,
        changedAt: new Date(),
        note: req.body.note || "",
      });
      application.reviewedBy = req.userId;
      application.reviewedAt = new Date();
      await application.save();

      return apiResponse({
        res,
        status: 200,
        data: { application },
        message: "Application status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
