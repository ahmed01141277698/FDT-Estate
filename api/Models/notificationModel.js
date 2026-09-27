import mongoose from "mongoose";
import { NOTIFICATION_TYPE_VALUES } from "../Constants/notificationTypes.js";
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
      enum: NOTIFICATION_TYPE_VALUES,
      default: "system",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
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
    readAt: {
      type: Date,
    },

    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },

    deduplicationKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    groupKey: {
      type: String,
      index: true,
    },
    groupCount: {
      type: Number,
      default: 1,
    },
    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
