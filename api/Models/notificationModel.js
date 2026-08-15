import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "message",
        "listing_liked",
        "listing_view",
        "price_change",
        "listing_approved",
        "verification",
        "system",
      ],
      default: "system",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    // مسار داخل الموقع يتنقل له المستخدم لما يضغط على الإشعار (مثلاً /listing/123)
    link: {
      type: String,
    },
    relatedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;