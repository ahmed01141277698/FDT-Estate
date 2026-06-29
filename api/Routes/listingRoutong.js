import express from 'express';
import { createListing } from '../Controlles/listingControll.js';
 import { verifyToken } from '../Middleware/authMiddleware.js';
// , getAllListings, getListingById, updateListing, deleteListing
const ListingRouter = express.Router();

ListingRouter.post('/createListing', verifyToken , createListing);   
// ListingRouter.get('/all', getAllListings);
// ListingRouter.get('/:id', getListingById);
// ListingRouter.put('/:id', updateListing);
// ListingRouter.delete('/:id', deleteListing);

export default ListingRouter;