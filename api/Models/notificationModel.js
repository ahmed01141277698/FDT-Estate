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
    // READ = المستخدم دخل/ضغط على الإشعار فعليًا (فتح تفاصيله أو تنقّل منه)
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    // SEEN = الإشعار ظهر قدام المستخدم في الليستة (حتى لو ماضغطش عليه) —
    // بيتحدث لوحده أول ما يتجاب ضمن نتيجة getNotifications.
    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
    // مفتاح فريد اختياري لمنع تكرار نفس الإشعار لو نفس الحدث اتنفّذ مرتين
    // (retry من الشبكة، ضغطتين سريعة، إلخ).
    deduplicationKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    // --- التجميع الذكي ---
    // groupKey: نفس المفتاح لكل الأحداث اللي المفروض تتجمّع مع بعض (مثلاً
    // كل "حفظ مفضلة" لنفس العقار). طول ما فيه إشعار غير مقروء بنفس المفتاح،
    // أي حدث جديد بيتجمّع فيه بدل ما يعمل إشعار مستقل.
    groupKey: {
      type: String,
      index: true,
    },
    groupCount: {
      type: Number,
      default: 1,
    },
    // آخر كام شخص (فاعل) ساهموا في المجموعة دي — بنحتفظ بآخر 5 بس.
    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // وقت آخر نشاط في المجموعة — بيتستخدم للترتيب (newest first) بدل
    // createdAt وحده، عشان إشعار مجمّع لما يحصل فيه نشاط جديد يطلع فوق تاني.
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