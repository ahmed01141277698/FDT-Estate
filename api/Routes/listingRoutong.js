import express from 'express';
import { createListing, getUserListings, getListingById, updateListing, deleteListing, detailsListing } from '../Controlles/listingControll.js';
import {smartSearchListings} from '../Controlles/searchController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const ListingRouter = express.Router();

ListingRouter.post('/createListing', verifyToken, createListing);
ListingRouter.get('/search', smartSearchListings);
ListingRouter.get('/details/:id', verifyToken, detailsListing);
ListingRouter.get('/user/:id', verifyToken, getUserListings);
ListingRouter.get('/:id', verifyToken, getListingById);
ListingRouter.put('/:id', verifyToken, updateListing);
ListingRouter.delete('/:id', verifyToken, deleteListing);

export default ListingRouter;