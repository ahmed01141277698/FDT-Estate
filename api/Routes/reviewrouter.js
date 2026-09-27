import express from "express";
import {
  createReview,
  getReviews,
  getMyReview,
} from "../Controllers/reviewController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const ReviewRouter = express.Router();

ReviewRouter.get("/", getReviews);
ReviewRouter.get("/me", verifyToken, getMyReview);
ReviewRouter.post("/", verifyToken, createReview);

export default ReviewRouter;
