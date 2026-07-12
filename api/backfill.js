
import Listing from "./Models/listingModel.js";
import { generateListingSearchData } from "./searchEngine/utils/keywordGenerator.js";

async function backfill() {
  const listings = await Listing.find({});
  for (const listing of listings) {
    const { searchKeywords, resolvedLocation } = generateListingSearchData(listing);
    listing.searchKeywords = searchKeywords;
    listing.resolvedLocation = resolvedLocation;
    await listing.save({ validateBeforeSave: false });
  }
  console.log(`Backfilled ${listings.length} listings.`);
}