import User from "../Models/user_Model.js";
import Listing from "../Models/listingModel.js";

// عامة بالكامل (بدون verifyToken) — أي زائر يقدر يفتح بروفايل أي مستخدم عام.
// بترجع بيانات المستخدم العامة + عقاراته + إحصائيات مجمّعة في نداء واحد
// بدل ما الفرونت يعمل 3 نداءات منفصلة.
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username avatar isVerified phone socialLinks accountType createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const listings = await Listing.find({ userRef: user._id }).sort({
      createdAt: -1,
    });

    const stats = listings.reduce(
      (acc, listing) => {
        acc.totalViews += listing.views || 0;
        acc.totalFavorites += listing.favoritesCount || 0;
        return acc;
      },
      { totalViews: 0, totalFavorites: 0 },
    );

    res.status(200).json({
      user,
      listings,
      stats: { ...stats, listingsCount: listings.length },
    });
  } catch (error) {
    next(error);
  }
};
