import Favorite from "../Models/favoriteModel.js";
import Listing from "../Models/listingModel.js";
import User from "../Models/user_Model.js";
import mongoose from "mongoose";
import { upsertGroupedNotification } from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";

/**
 * Toggle Favorite
 * POST /api/listing/favorites/:listingId
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing id",
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const existingFavorite = await Favorite.findOne({
      userRef: userId,
      listingRef: listingId,
    });

    // Remove Favorite
    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);

      await Listing.findByIdAndUpdate(listingId, {
        $inc: { favoritesCount: -1 },
      });

      return res.status(200).json({
        success: true,
        favorited: false,
        message: "Removed from favorites",
      });
    }

    // Add Favorite
    await Favorite.create({
      userRef: userId,
      listingRef: listingId,
    });

    await Listing.findByIdAndUpdate(listingId, {
      $inc: { favoritesCount: 1 },
    });

    // إشعار مجمّع للمالك — بس لو مش هو نفسه اللي حفظ عقاره. طول ما فيه
    // إشعار "حفظ مفضلة" غير مقروء لنفس العقار، أي حفظ جديد بيتجمّع فيه
    // بدل ما يعمل إشعار منفصل لكل شخص.
    if (listing.userRef.toString() !== userId) {
      const actingUser = await User.findById(userId).select("username");
      const actorName = actingUser?.username || "مستخدم";

      await upsertGroupedNotification({
        recipient: listing.userRef,
        groupKey: `favorite_group:${listingId}`,
        type: NOTIFICATION_TYPES.LISTING_LIKED,
        link: `/listing/${listing._id}`,
        relatedListing: listing._id,
        actorId: userId,
        buildTitle: (count) =>
          count === 1
            ? `${actorName} حفظ عقارك في المفضلة`
            : `${actorName} و${count - 1} آخرين حفظوا عقارك في المفضلة`,
        buildBody: () => `عقارك "${listing.name}"`,
      });
    }

    return res.status(200).json({
      success: true,
      favorited: true,
      message: "Added to favorites",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * Get User Favorites
 * GET /api/listing/favorites
 */
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const favorites = await Favorite.find({
      userRef: userId,
    })
      .populate("listingRef")
      .sort({ createdAt: -1 });

    const listings = favorites
      .filter((item) => item.listingRef)
      .map((item) => item.listingRef);

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};