import Job from "../Models/jobModel.js";
import Article from "../Models/articleModel.js";
import ContactMessage from "../Models/contactMessageModel.js";
import JobApplication from "../Models/jobApplicationModel.js";
import { buildPagination } from "../utils/response.js";
import {
  isValidObjectId,
  normalizeSlug,
  sanitizeText,
} from "../utils/validators.js";

export const listPublishedJobs = async ({
  page = 1,
  limit = 12,
  search = "",
  department = "",
  location = "",
  employmentType = "",
  experienceLevel = "",
}) => {
  const filter = {
    status: "published",
    deletedAt: null,
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (department) filter.department = department;
  if (location) filter.location = new RegExp(location, "i");
  if (employmentType) filter.employmentType = employmentType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;

  const total = await Job.countDocuments(filter);
  const pagination = buildPagination({ page, limit, total });

  const jobs = await Job.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit)
    .lean();

  return {
    jobs,
    pagination,
  };
};

export const getJobBySlug = async (slug) => {
  const job = await Job.findOne({
    slug,
    status: "published",
    deletedAt: null,
  }).lean();
  return job;
};

export const createJobFromPayload = async (payload, userId) => {
  const title = sanitizeText(payload.title || "");
  const slug = normalizeSlug(payload.slug || title);

  const data = {
    ...payload,
    title,
    slug,
    createdBy: userId,
    updatedBy: userId,
    ...(payload.status === "published"
      ? { publishedAt: new Date(), publishedBy: userId }
      : {}),
  };

  return Job.create(data);
};

export const updateJobById = async (jobId, payload, userId) => {
  if (!isValidObjectId(jobId)) throw new Error("INVALID_ID");

  const update = { ...payload, updatedBy: userId };
  if (payload.status === "published" && !payload.publishedAt) {
    update.publishedAt = new Date();
    update.publishedBy = userId;
  }

  return Job.findByIdAndUpdate(jobId, update, {
    new: true,
    runValidators: true,
  });
};

export const listPublishedArticles = async ({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  featured = "",
  tag = "",
}) => {
  const filter = {
    status: "published",
    deletedAt: null,
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;
  if (tag) filter.tags = tag;

  const total = await Article.countDocuments(filter);
  const pagination = buildPagination({ page, limit, total });

  const articles = await Article.find(filter)
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .skip((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit)
    .lean();

  return { articles, pagination };
};

export const getArticleBySlug = async (slug) => {
  const article = await Article.findOne({
    slug,
    status: "published",
    deletedAt: null,
  }).lean();
  return article;
};

export const incrementArticleViews = async (articleId) => {
  if (!isValidObjectId(articleId)) return;
  await Article.findByIdAndUpdate(articleId, { $inc: { views: 1 } });
};

export const createContactMessage = async (payload) => {
  return ContactMessage.create(payload);
};

export const listPublishedCategories = async () => {
  const categories = await Article.distinct("category", {
    status: "published",
    deletedAt: null,
  });
  return categories.filter(Boolean);
};

export const getJobApplicationsByJobId = async (jobId) => {
  if (!isValidObjectId(jobId)) throw new Error("INVALID_ID");
  return JobApplication.find({ jobId, deletedAt: null })
    .sort({ createdAt: -1 })
    .lean();
};

export const createApplication = async (jobId, payload) => {
  if (!isValidObjectId(jobId)) throw new Error("INVALID_ID");
  return JobApplication.create({ ...payload, jobId });
};
