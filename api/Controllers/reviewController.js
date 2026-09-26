import Review from "../Models/reviewModel.js";
// get the current user's review, if it exists, and return it in the response. If no review is found, return null.
export const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ userRef: req.userId });
    res.status(200).json(review || null);
  } catch (error) {
    next(error);
  }
};
// create or update a review for the current user. If a review already exists, it will be updated; otherwise, a new review will be created. The response will contain the newly created or updated review.
export const createReview = async (req, res, next) => {
  try {
    const { rating, text, role, city } = req.body;

    if (!rating || !text?.trim()) {
      return res.status(400).json({ message: "التقييم ونص المراجعة مطلوبان" });
    }

    const review = await Review.findOneAndUpdate(
      { userRef: req.userId },
      { rating, text: text.trim(), role, city },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    ).populate("userRef", "username avatar isVerified");

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// get all approved reviews, along with the average rating and total number of reviews. The response will contain the reviews, average rating, and total reviews count.
//  this function is used in section 4 of the home page to display reviews and ratings from users.
export const getReviews = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

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
