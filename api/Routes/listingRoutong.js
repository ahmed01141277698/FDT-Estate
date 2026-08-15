import express from 'express';
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
  getTopFavoritedListings,
} from '../Controlles/listingControll.js';
import {
  toggleFavorite,
  getUserFavorites,
} from '../Controlles/favoriteController.js';
import { smartSearchListings } from '../Controlles/searchController.js';
import{getMarketInsights} from '../Controlles/statscontroller.js'
import { verifyToken } from '../Middleware/authMiddleware.js';

const ListingRouter = express.Router();

ListingRouter.post('/createListing', verifyToken, createListing);

// ⚠️ الترتيب مهم في Express: أي مسار ثابت (زي /categories) لازم يتسجّل
// قبل /:id، وإلا هيتفهم "categories" على إنها قيمة الـ id.
ListingRouter.get('/', getAllListings);
ListingRouter.get('/categories', getListingCategories);
ListingRouter.get("/category-counts", getCategoryCounts);
ListingRouter.get('/search', smartSearchListings);
ListingRouter.get("/market-insights", getMarketInsights);
// Favorites
ListingRouter.post(
  '/favorites/:listingId',
  verifyToken,
  toggleFavorite
);

ListingRouter.get(
  '/favorites',
  verifyToken,
  getUserFavorites
);



ListingRouter.get(
  "/top-favorites/:userId",
  getTopFavoritedListings
);

// شيلت verifyToken من هنا عشان أي زائر (من غير تسجيل دخول) يقدر يفتح تفاصيل
// العقار — لو ده مش المطلوب وعايزها تفضل تتطلب تسجيل دخول، رجّعها زي ما كانت.
ListingRouter.get('/details/:id', detailsListing);

ListingRouter.get('/user/:id', verifyToken, getUserListings);
ListingRouter.get('/:id', verifyToken, getListingById);
ListingRouter.put('/:id', verifyToken, updateListing);
ListingRouter.delete('/:id', verifyToken, deleteListing);

export default ListingRouter;