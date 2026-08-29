import express from "express";
import { simpleRateLimiter } from "../Middleware/simpleRateLimiter.js";
import { verifyToken, requireAdmin } from "../Middleware/authMiddleware.js";
import { apiResponse } from "../utils/response.js";
import {
  normalizeSlug,
  sanitizeText,
  sanitizeHtml,
} from "../utils/validators.js";
import Article from "../Models/articleModel.js";
import {
  listPublishedArticles,
  getArticleBySlug,
  incrementArticleViews,
  listPublishedCategories,
} from "../Services/adminContentService.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { page, limit, search, category, featured, tag } = req.query;
    const result = await listPublishedArticles({
      page,
      limit,
      search,
      category,
      featured,
      tag,
    });

    return apiResponse({
      res,
      status: 200,
      data: result,
      message: "Articles retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await listPublishedCategories();
    return apiResponse({
      res,
      status: 200,
      data: categories,
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const article = await getArticleBySlug(req.params.slug);
    if (!article) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "ARTICLE_NOT_FOUND",
        message: "Article not found",
      });
    }

    await incrementArticleViews(article._id);
    return apiResponse({
      res,
      status: 200,
      data: { article },
      message: "Article retrieved successfully",
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
      excerpt: sanitizeText(req.body.excerpt || ""),
      content: sanitizeHtml(req.body.content || ""),
      slug: normalizeSlug(req.body.slug || req.body.title),
      createdBy: req.userId,
      updatedBy: req.userId,
    };

    if (
      !payload.title ||
      !payload.excerpt ||
      !payload.content ||
      !payload.category
    ) {
      return apiResponse({
        res,
        status: 400,
        success: false,
        code: "VALIDATION_ERROR",
        message: "Missing required article fields",
      });
    }

    const article = await Article.create(payload);
    return apiResponse({
      res,
      status: 201,
      data: { article },
      message: "Article created successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const update = { ...req.body, updatedBy: req.userId };
    if (req.body.title) update.title = sanitizeText(req.body.title);
    if (req.body.excerpt) update.excerpt = sanitizeText(req.body.excerpt);
    if (req.body.content) update.content = sanitizeHtml(req.body.content);
    if (req.body.title || req.body.slug)
      update.slug = normalizeSlug(
        req.body.slug || req.body.title || update.title,
      );

    const article = await Article.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "ARTICLE_NOT_FOUND",
        message: "Article not found",
      });
    }

    return apiResponse({
      res,
      status: 200,
      data: { article },
      message: "Article updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return apiResponse({
        res,
        status: 404,
        success: false,
        code: "ARTICLE_NOT_FOUND",
        message: "Article not found",
      });
    }

    article.deletedAt = new Date();
    article.status = "archived";
    await article.save();

    return apiResponse({
      res,
      status: 200,
      message: "Article archived successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
