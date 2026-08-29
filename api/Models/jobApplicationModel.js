import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    linkedInUrl: {
      type: String,
      trim: true,
      default: "",
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    cv: {
      url: { type: String, required: true },
      storageProvider: { type: String, default: "local" },
      publicId: { type: String, default: "" },
      originalFilename: { type: String, default: "" },
      mimeType: { type: String, default: "application/pdf" },
      size: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: [
        "submitted",
        "reviewing",
        "shortlisted",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      default: "submitted",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "submitted",
            "reviewing",
            "shortlisted",
            "interview",
            "offer",
            "hired",
            "rejected",
            "withdrawn",
          ],
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
    internalNotes: [
      {
        text: { type: String, required: true },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ["website", "career_page", "referral", "linkedin"],
      default: "career_page",
    },
  },
  {
    timestamps: true,
  },
);

jobApplicationSchema.index({ jobId: 1, status: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, createdAt: -1 });
jobApplicationSchema.index({ deletedAt: 1 });

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
