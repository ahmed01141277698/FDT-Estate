// import Listing from "../Models/listingModel.js";

// export const createListing = async (req, res, next) => {
//   try {
//     const newListing = await Listing.create(req.body);
//     res.status(201).json(newListing);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUserListings = async (req, res, next) => {
//   try {
//     const listings = await Listing.find({ userRef: req.params.id }).sort({ createdAt: -1 });
//     res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getListingById = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     res.status(200).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     if (listing.userRef.toString() !== req.userId) {
//       return res.status(403).json({ message: "You are not allowed to edit this listing" });
//     }

//     const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     res.status(200).json(updatedListing);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteListing = async (req, res, next) => {
    
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     if (listing.userRef.toString() !== req.userId) {
//       return res.status(403).json({ message: "You are not allowed to delete this listing" });
//     }

//     await Listing.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Listing deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const detailsListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     res.status(200).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };


import Listing from "../Models/listingModel.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

// جلب كل العقارات مع فلاتر وصفحات — تُستخدم في الصفحة الرئيسية وصفحة "جميع العقارات".
export const getAllListings = async (req, res, next) => {
  try {
    const {
      category,
      type,
      featured,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === "true";
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const numericPage = Math.max(Number(page) || 1, 1);
    const numericLimit = Math.min(Number(limit) || 12, 50);
    const skip = (numericPage - 1) * numericLimit;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        // عدّل أسماء الحقول دي على حسب الـ User schema الحقيقي عندك.
        .populate("userRef", "username avatar accountType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      listings,
      total,
      page: numericPage,
      totalPages: Math.ceil(total / numericLimit),
    });
  } catch (error) {
    next(error);
  }
};

// القيم الفعلية المتاحة لحقل `category` — تُستخدم لبناء أزرار الفلاتر ديناميكيًا في الفرونت.
export const getListingCategories = async (req, res, next) => {
  try {
    const categories = await Listing.distinct("category");
    res.status(200).json(categories.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to edit this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userRef.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// عامة (بدون verifyToken) — أي زائر يقدر يفتح تفاصيل العقار.
export const detailsListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      // عدّل أسماء الحقول دي على حسب الـ User schema الحقيقي عندك.
      .populate("userRef", "username avatar accountType");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};