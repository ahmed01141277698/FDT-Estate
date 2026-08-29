import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
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
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    category: {
      type: String,
      enum: [
        "general_inquiry",
        "technical_support",
        "property_issue",
        "partnership",
        "business_inquiry",
        "report_problem",
        "careers",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: [
        "new",
        "in_progress",
        "waiting_user",
        "resolved",
        "closed",
        "spam",
      ],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
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
    source: {
      type: String,
      enum: ["website", "footer", "contact_page"],
      default: "contact_page",
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ priority: 1, createdAt: -1 });
contactMessageSchema.index({ category: 1, createdAt: -1 });
contactMessageSchema.index({ deletedAt: 1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
