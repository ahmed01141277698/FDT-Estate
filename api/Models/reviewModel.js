import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // مراجعة واحدة فعّالة لكل مستخدم (تعديلها بيحدّث نفس المراجعة)
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    role: {
      type: String, // المهنة، يكتبها المستخدم بنفسه، اختياري
      default: "",
    },
    city: {
      type: String, // اختياري
      default: "",
    },
    // TODO: حوّلها لـ default: false لو هتضيف لوحة موافقة إدارية قبل النشر لاحقًا.
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ approved: 1, createdAt: -1 });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;