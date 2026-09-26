import mongoose from "mongoose";
import User from "../Models/user_Model.js";
import Listing from "../Models/listingModel.js";
// this function retrieves a public profile of a user based on their ID, along with their listings and statistics.
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "معرّف المستخدم غير صالح",
      });
    }
    const limit = 12;
    // read the page number from the query parameters, defaulting to 1 if not provided or invalid.
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    // get the user by ID, selecting only specific fields to return in the response.
    const user = await User.findById(id)
      .select(
        "username avatar isVerified phone socialLinks accountType createdAt",
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    // Use Promise.all to fetch the user's listings and statistics concurrently, improving performance by reducing the total time taken for both queries.
    const [statsResult, listings] = await Promise.all([
      Listing.aggregate([
        {
          $match: {
            userRef: user._id,
          },
        },
        {
          $group: {
            _id: null,
            listingsCount: { $sum: 1 },
            totalViews: {
              $sum: {
                $ifNull: ["$views", 0],
              },
            },
            totalFavorites: {
              $sum: {
                $ifNull: ["$favoritesCount", 0],
              },
            },
          },
        },
      ]),

      Listing.find({
        userRef: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const stats = statsResult[0] || {
      listingsCount: 0,
      totalViews: 0,
      totalFavorites: 0,
    };

    const totalListings = stats.listingsCount;
    const totalPages = Math.ceil(totalListings / limit);
    res.status(200).json({
      success: true,
      user,
      listings,
      stats: {
        totalViews: stats.totalViews,
        totalFavorites: stats.totalFavorites,
        listingsCount: totalListings,
      },

      pagination: {
        page,
        limit,
        total: totalListings,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
