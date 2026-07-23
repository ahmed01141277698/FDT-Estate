import Review from "../Models/reviewModel.js";

// مراجعة المستخدم الحالي (لو موجودة) — تُستخدم لتعبئة الفورم مسبقًا عند التعديل.
export const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ userRef: req.userId });
    res.status(200).json(review || null);
  } catch (error) {
    next(error);
  }
};

// كتابة أو تعديل مراجعة المستخدم الحالي — مراجعة واحدة فعّالة لكل شخص.
export const createReview = async (req, res, next) => {
  try {
    const { rating, text, role, city } = req.body;

    if (!rating || !text?.trim()) {
      return res.status(400).json({ message: "التقييم ونص المراجعة مطلوبان" });
    }

    const review = await Review.findOneAndUpdate(
      { userRef: req.userId },
      { rating, text: text.trim(), role, city },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true, runValidators: true },
    ).populate("userRef", "username avatar isVerified");

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// المراجعات المنشورة + متوسط التقييم والعدد الكلي — تُستخدم في سيكشن آراء العملاء.
export const getReviews = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const [reviews, stats] = await Promise.all([
      Review.find({ approved: true })
        .populate("userRef", "username avatar isVerified")
        .sort({ createdAt: -1 })
        .limit(Number(limit)),
      Review.aggregate([
        { $match: { approved: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.status(200).json({
      reviews,
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
    });
  } catch (error) {
    next(error);
  }
};