import express from "express";
import {
  createListing,
  getAllListings,
  getListingCategories,
  getUserListings,
  getListingById,
  updateListing,
  deleteListing,
  detailsListing,
  getCategoryCounts,
  notifyListingInterest, // ← جديدة
  getTopFavoritedListings,
} from "../Controllers/listingControll.js";
import {
  toggleFavorite,
  getUserFavorites,
} from "../Controllers/favoriteController.js";
import { smartSearchListings } from "../Controllers/searchController.js";
import { getMarketInsights } from "../Controllers/statscontroller.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const ListingRouter = express.Router();

ListingRouter.post("/createListing", verifyToken, createListing);

// Public routes
ListingRouter.get("/", getAllListings);
ListingRouter.get("/categories", getListingCategories);
ListingRouter.get("/category-counts", getCategoryCounts);
ListingRouter.get("/search", smartSearchListings);
ListingRouter.get("/market-insights", getMarketInsights);
// Favorites
ListingRouter.post("/favorites/:listingId", verifyToken, toggleFavorite);
ListingRouter.get("/favorites", verifyToken, getUserFavorites);
ListingRouter.get("/top-favorites/:userId", getTopFavoritedListings);
ListingRouter.post("/:id/interest", notifyListingInterest);

//  details route should be placed before the /:id route to avoid conflicts

ListingRouter.get("/details/:id", detailsListing);

ListingRouter.get("/user/:id", verifyToken, getUserListings);
ListingRouter.get("/:id", verifyToken, getListingById);
ListingRouter.put("/:id", verifyToken, updateListing);
ListingRouter.delete("/:id", verifyToken, deleteListing);

export default ListingRouter;
