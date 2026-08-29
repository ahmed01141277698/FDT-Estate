import express from "express";
import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";
import { apiResponse } from "../utils/response.js";
import ContactMessage from "../Models/contactMessageModel.js";
import { sanitizeText } from "../utils/validators.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const payload = {
      name: sanitizeText(req.body.name),
      email: String(req.body.email || "").trim(),
      phone: sanitizeText(req.body.phone || ""),
      subject: sanitizeText(req.body.subject),
      category: req.body.category || "general_inquiry",
      message: sanitizeText(req.body.message),
      source: req.body.source || "website",
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      return apiResponse({
        res,
        status: 400,
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please fill in all required fields",
      });
    }

    const contactMessage = await ContactMessage.create(payload);
    return apiResponse({
      res,
      status: 201,
      data: { contactMessage },
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(filter),
    ]);

    return apiResponse({
      res,
      status: 200,
      data: {
        messages: items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)) || 1,
        },
      },
      message: "Messages retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:id/status",
  verifyToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const message = await ContactMessage.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          priority: req.body.priority || undefined,
          internalNotes: req.body.internalNotes,
          updatedBy: req.userId,
        },
        { new: true, runValidators: true },
      );

      if (!message) {
        return apiResponse({
          res,
          status: 404,
          success: false,
          code: "MESSAGE_NOT_FOUND",
          message: "Message not found",
        });
      }

      return apiResponse({
        res,
        status: 200,
        data: { message },
        message: "Message status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
