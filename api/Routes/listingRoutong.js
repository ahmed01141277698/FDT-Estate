// import express from 'express';
// import { createListing, getUserListings, getListingById, updateListing, deleteListing, detailsListing } from '../Controlles/listingControll.js';
// import {smartSearchListings} from '../Controlles/searchController.js';
// import { verifyToken } from '../Middleware/authMiddleware.js';

// const ListingRouter = express.Router();

// ListingRouter.post('/createListing', verifyToken, createListing);
// ListingRouter.get('/search', smartSearchListings);

// ListingRouter.get('/details/:id', verifyToken, detailsListing);
// ListingRouter.get('/user/:id', verifyToken, getUserListings);
// ListingRouter.get('/:id', verifyToken, getListingById);
// ListingRouter.put('/:id', verifyToken, updateListing);
// ListingRouter.delete('/:id', verifyToken, deleteListing);

// export default ListingRouter;


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
} from '../Controlles/listingControll.js';
import { smartSearchListings } from '../Controlles/searchController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const ListingRouter = express.Router();

ListingRouter.post('/createListing', verifyToken, createListing);

// ⚠️ الترتيب مهم في Express: أي مسار ثابت (زي /categories) لازم يتسجّل
// قبل /:id، وإلا هيتفهم "categories" على إنها قيمة الـ id.
ListingRouter.get('/', getAllListings);
ListingRouter.get('/categories', getListingCategories);
ListingRouter.get('/search', smartSearchListings);

// شيلت verifyToken من هنا عشان أي زائر (من غير تسجيل دخول) يقدر يفتح تفاصيل
// العقار — لو ده مش المطلوب وعايزها تفضل تتطلب تسجيل دخول، رجّعها زي ما كانت.
ListingRouter.get('/details/:id', detailsListing);

ListingRouter.get('/user/:id', verifyToken, getUserListings);
ListingRouter.get('/:id', verifyToken, getListingById);
ListingRouter.put('/:id', verifyToken, updateListing);
ListingRouter.delete('/:id', verifyToken, deleteListing);

export default ListingRouter;