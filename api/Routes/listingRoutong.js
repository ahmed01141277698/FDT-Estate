import express from 'express';
import { createListing, getUserListings, getListingById, updateListing, deleteListing } from '../Controlles/listingControll.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const ListingRouter = express.Router();

ListingRouter.post('/createListing', verifyToken, createListing);
ListingRouter.get('/user/:id', verifyToken, getUserListings);
ListingRouter.get('/:id', verifyToken, getListingById);
ListingRouter.put('/:id', verifyToken, updateListing);
ListingRouter.delete('/:id', verifyToken, deleteListing);
// ListingRouter.get('/:id', verifyToken, getListingById);

export default ListingRouter;