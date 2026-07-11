/**
 * rankingService.js
 *
 * Ranking happens primarily inside the aggregation pipeline (relevanceScore
 * + $sort in mongoQueryBuilder.js). This is a fallback in-memory sorter for
 * the rare case results come from `.find()` instead of `.aggregate()`.
 *
 * Priority: exact match > location match > property type match (via
 * searchKeywords) > featured > newest.
 */

const RANK_WEIGHTS = {
  exactMatch: 50,
  locationMatch: 30,
  propertyMatch: 20,
  purposeMatch: 10,
  featured: 15,
};

function computeScore(listing, intent) {
  let score = 0;

  const locationMatches = intent.resolvedLocation && listing.resolvedLocation === intent.resolvedLocation;
  const purposeMatches = intent.purpose && listing.type === intent.purpose;
  const propertyMatches =
    intent.propertyTypeKeywords?.length > 0 &&
    listing.searchKeywords?.some((k) => intent.propertyTypeKeywords.includes(k));

  if (locationMatches) score += RANK_WEIGHTS.locationMatch;
  if (propertyMatches) score += RANK_WEIGHTS.propertyMatch;
  if (purposeMatches) score += RANK_WEIGHTS.purposeMatch;
  if (locationMatches && propertyMatches && purposeMatches) score += RANK_WEIGHTS.exactMatch;
  if (listing.featured) score += RANK_WEIGHTS.featured;

  return score;
}

export function rankListings(listings, intent) {
  return [...listings].sort((a, b) => {
    const scoreDiff = computeScore(b, intent) - computeScore(a, intent);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export { computeScore, RANK_WEIGHTS };
