import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Engineering",
        "Product",
        "Design",
        "Marketing",
        "Operations",
        "Sales",
        "Customer Success",
        "Business",
        "HR",
        "Data",
        "Legal",
      ],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract",
        "Remote",
        "Hybrid",
        "On-site",
      ],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["remote", "hybrid", "on-site"],
      default: "on-site",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Junior", "Mid", "Senior", "Lead"],
      default: "Mid",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    niceToHave: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "EGP" },
      note: String,
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "paused", "closed", "archived"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ status: 1, publishedAt: -1 });
jobSchema.index({ department: 1, location: 1 });
jobSchema.index({ isFeatured: 1, publishedAt: -1 });
jobSchema.index({ deletedAt: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
