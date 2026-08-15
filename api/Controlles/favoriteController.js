import Favorite from "../Models/favoriteModel.js";
import Listing from "../Models/listingModel.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";

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

    // إشعار للمالك — بس لو مش هو نفسه اللي حفظ عقاره. dedup يوم بيوم عشان
    // لو حد شال العقار من مفضلته ورجّعه تاني في نفس اليوم متبعتش له إشعار
    // تاني، لكن لو حصل تاني بكرة يبعت من جديد.
    if (listing.userRef.toString() !== userId) {
      const todayBucket = new Date().toISOString().slice(0, 10);
      await createNotification({
        recipient: listing.userRef,
        type: "listing_liked",
        title: "حد حفظ عقارك في المفضلة",
        body: `عقارك "${listing.name}" اتضاف لمفضلة حد جديد`,
        link: `/listing/${listing._id}`,
        relatedListing: listing._id,
        relatedUser: userId,
        deduplicationKey: `favorite:${listingId}:${userId}:${todayBucket}`,
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