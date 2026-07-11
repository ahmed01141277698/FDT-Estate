/**
 * searchController.js
 *
 * New, standalone controller — does not modify listingControll.js at all.
 * All logic lives in searchEngine/searchService.js.
 */

import { smartSearch } from "../searchEngine/searchService.js";

export const smartSearchListings = async (req, res, next) => {
  try {
    const { q = "", page = "1", limit = "20" } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const result = await smartSearch(q, { page: parsedPage, limit: parsedLimit });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
