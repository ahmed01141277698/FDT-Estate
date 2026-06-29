import Listing from "../Models/listingModel.js";

export const createListing = async (req, res, next) => {

    try{
        const newListing = await Listing.create(req.body);
        res.status(201).json(newListing);
    } catch (error) {
        next(error);
    }
};

