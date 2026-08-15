import Listing from "../Models/listingModel.js";
import Favorite from "../Models/favoriteModel.js";
import { createNotification, upsertGroupedNotification } from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);

    // إشعار تأكيد للمالك إن عقاره نُشر بنجاح — dedup بمفتاح ثابت لأن عقار
    // معيّن مفروض يتنشر مرة واحدة بس أصلاً.
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

// جلب كل العقارات مع فلاتر وصفحات — تُستخدم في الصفحة الرئيسية وصفحة "جميع العقارات".
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

// القيم الفعلية المتاحة لحقل `category` — تُستخدم لبناء أزرار الفلاتر ديناميكيًا في الفرونت.
export const getListingCategories = async (req, res, next) => {
  try {
    const categories = await Listing.distinct("category");
    res.status(200).json(categories.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

// عدد العقارات في كل تصنيف — لازم يرجع Array مش Object، لأن الفرونت إند
// (Discover.jsx, AllListings.jsx) بيعمل عليها .map() مباشرة بشكل [{category, count}].
// export const getCategoryCounts = async (req, res, next) => {
//   try {
//     const counts = await Listing.aggregate([
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     const result = counts
//       .filter((item) => item._id)
//       .map((item) => ({ category: item._id, count: item.count }));

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

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

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id }).sort({ createdAt: -1 });
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
      return res.status(403).json({ message: "You are not allowed to edit this listing" });
    }

    const oldPrice = listing.price;

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

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
              title: "انخفض سعر عقار في مفضلتك 🎉",
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

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userRef.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// عامة (بدون verifyToken) — أي زائر يقدر يفتح تفاصيل العقار.
// كل فتح بيزوّد عداد المشاهدات بواحد ($inc) بعملية ذرّية آمنة.
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

// عامة — بتتنادى من زراير "اتصال" و"واتساب" في ContactCard. مجمّعة عشان
// لو أكتر من زائر حاول يتواصل قبل ما المالك يقرا الإشعار، يوصله إشعار
// واحد ("3 أشخاص حاولوا التواصل معاك") بدل سبام. من غير verifyToken لأن
// زوار غير مسجلين برضو المفروض يقدروا يتواصلوا مع المالك.
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
          ? "فيه حد مهتم بعقارك"
          : `فيه ${count} أشخاص مهتمين بعقارك`,
      buildBody: () =>
        `آخر محاولة تواصل بخصوص "${listing.name}" كانت عن طريق ${channelLabel}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

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