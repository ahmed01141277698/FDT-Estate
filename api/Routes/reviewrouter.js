import express from "express";
import { createReview, getReviews, getMyReview } from "../Controlles/reviewController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const ReviewRouter = express.Router();

ReviewRouter.get("/", getReviews);
ReviewRouter.get("/me", verifyToken, getMyReview);
ReviewRouter.post("/", verifyToken, createReview);

export default ReviewRouter;

// في ملف الـ app الرئيسي، ضيف السطر ده جنب باقي الراوترز:
// app.use("/api/reviews", ReviewRouter);