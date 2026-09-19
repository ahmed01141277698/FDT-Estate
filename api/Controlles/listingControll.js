import Listing from "../Models/listingModel.js";
import Favorite from "../Models/favoriteModel.js";
import {
  createNotification,
  upsertGroupedNotification,
} from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";

// create listing and send notification to the owner of the listing that their listing has been published
export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    //   // Send notification to the owner of the listing that their listing has been published
    await createNotification({
      recipient: newListing.userRef,
      type: NOTIFICATION_TYPES.LISTING_APPROVED,
      title: "تم نشر عقارك بنجاح",
      body: `عقارك "${newListing.name}" أصبح متاحًا الآن على الموقع`,
      link: `/listing/${newListing._id}`,
      relatedListing: newListing._id,
      deduplicationKey: `listing_published:${newListing._id}`,
    });

    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

// get all listings with filters and pagination including category, type, featured, minPrice, maxPrice, bedrooms, bathrooms
export const getAllListings = async (req, res, next) => {
  try {
    const {
      category,
      type,
      featured,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === "true";
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const numericPage = Math.max(Number(page) || 1, 1);
    const numericLimit = Math.min(Number(limit) || 12, 50);
    const skip = (numericPage - 1) * numericLimit;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("userRef", "username avatar accountType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      listings,
      total,
      page: numericPage,
      totalPages: Math.ceil(total / numericLimit),
    });
  } catch (error) {
    next(error);
  }
};

// get all listings by user id and send notification to the owner of the listing that their listing has been viewed
export const getListingCategories = async (req, res, next) => {
  try {
    const categories = await Listing.distinct("category");
    res.status(200).json(categories.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

// get the count of listings in each category
export const getCategoryCounts = async (req, res, next) => {
  try {
    const counts = await Listing.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countsMap = counts.reduce((acc, item) => {
      if (item._id) acc[item._id] = item.count;
      return acc;
    }, {});
    res.status(200).json(countsMap);
  } catch (error) {
    next(error);
  }
};
// GET user's listings by user id
export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this listing" });
    }

    const oldPrice = listing.price;

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    // لو السعر اتغيّر فعلاً
    if (req.body.price !== undefined && Number(req.body.price) !== oldPrice) {
      const isDrop = Number(req.body.price) < oldPrice;

      // 1) إشعار تأكيد للمالك نفسه — dedup بقيمة السعر القديم/الجديد.
      await createNotification({
        recipient: updatedListing.userRef,
        type: NOTIFICATION_TYPES.PRICE_CHANGE,
        title: isDrop ? "تم تخفيض سعر عقارك" : "تم تحديث سعر عقارك",
        body: `تغيّر سعر "${updatedListing.name}" من ${oldPrice.toLocaleString()} إلى ${updatedListing.price.toLocaleString()} ج.م`,
        link: `/listing/${updatedListing._id}`,
        relatedListing: updatedListing._id,
        deduplicationKey: `price_change_owner:${updatedListing._id}:${oldPrice}:${updatedListing.price}`,
      });

      // 2) لو السعر نزل، إشعار لكل اللي حافظين العقار ده في مفضلتهم —
      // إشعار سعر واحد لكل متابع مهم يوصله بالتفاصيل، فمش محتاج تجميع هنا.
      if (isDrop) {
        const followers = await Favorite.find({
          listingRef: updatedListing._id,
        }).select("userRef");

        await Promise.all(
          followers.map((fav) =>
            createNotification({
              recipient: fav.userRef,
              type: NOTIFICATION_TYPES.PRICE_CHANGE,
              title: "انخفض سعر عقار في مفضلتك ",
              body: `"${updatedListing.name}" نزل سعره من ${oldPrice.toLocaleString()} إلى ${updatedListing.price.toLocaleString()} ج.م`,
              link: `/listing/${updatedListing._id}`,
              relatedListing: updatedListing._id,
              deduplicationKey: `price_drop_follower:${updatedListing._id}:${fav.userRef}:${updatedListing.price}`,
            }),
          ),
        );
      }
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
// delete listing by id and send notification to the owner of the listing that their listing has been deleted
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userRef.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });

    await createNotification({
      recipient: listing.userRef,
      type: NOTIFICATION_TYPES.LISTING_DELETED,
      title: "تم حذف عقارك",
      body: `تم حذف العقار "${listing.name}"`,
      link: `/`,
    });
  } catch (error) {
    next(error);
  }
};
// get listing details by id and increment views count
export const detailsListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate(
      "userRef",
      "username avatar accountType phone isVerified socialLinks",
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// notify listing interest by id and send notification to the owner of the listing that someone is interested in their listing
export const notifyListingInterest = async (req, res, next) => {
  try {
    const { channel } = req.body; // channel: "whatsapp" | "call"
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const channelLabel = channel === "whatsapp" ? "واتساب" : "مكالمة هاتفية";

    await upsertGroupedNotification({
      recipient: listing.userRef,
      groupKey: `interest_group:${listing._id}`,
      type: NOTIFICATION_TYPES.MESSAGE,
      link: `/listing/${listing._id}`,
      relatedListing: listing._id,
      // مفيش actorId هنا لأن الزائر ممكن يكون مش مسجل دخول أصلاً
      buildTitle: (count) =>
        count === 1
          ? "يوجد شخص مهتم بعقارك"
          : `يوجد ${count} أشخاص مهتمين بعقارك`,
      buildBody: () =>
        `آخر محاولة تواصل بخصوص "${listing.name}" كانت عن طريق ${channelLabel}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
// get top 5 favorited listings by user id
// this is used to show the user their most favorited listings in their profile page
export const getTopFavoritedListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      userRef: req.params.userId,
    })
      .sort({ favoritesCount: -1 })
      .limit(5);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
