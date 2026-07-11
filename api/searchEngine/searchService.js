/**
 * searchService.js
 *
 * Input -> Normalize -> Clean Text -> Arabic Normalization ->
 * English Normalization -> Tokenization -> Keyword Detection ->
 * Location Resolver -> Property Resolver -> Purpose Resolver ->
 * Price Resolver -> Mongo Query Builder -> Search Results
 *
 * Framework-agnostic - takes a raw query string, returns ranked listings.
 */

import Listing from '../Models/listingModel.js';
import { cleanAndNormalize } from './normalize/textCleaner.js';
import { tokenize } from './utils/tokenizer.js';
import { resolveLocation } from './resolvers/locationResolver.js';
import { resolvePropertyType } from './resolvers/propertyResolver.js';
import { resolvePurpose } from './resolvers/purposeResolver.js';
import { resolvePrice, PRICE_STRUCTURAL_WORDS } from './resolvers/priceResolver.js';
import { resolveRooms, ROOM_STRUCTURAL_WORDS } from './resolvers/roomResolver.js';
import { buildSearchPipeline } from './queryBuilder/mongoQueryBuilder.js';

function removeClaimedTokens(tokens, claimedRanges) {
  const claimedIndexes = new Set();
  claimedRanges.forEach((range) => {
    if (!range) return;
    for (let i = range[0]; i <= range[1]; i += 1) claimedIndexes.add(i);
  });
  return tokens.filter((_, index) => !claimedIndexes.has(index));
}

/**
 * Resolves a raw search string into structured search intent.
 * Exported separately so it's unit-testable without touching Mongo.
 */
export function resolveSearchIntent(rawQuery) {
  const normalizedText = cleanAndNormalize(rawQuery || '');
  const tokens = tokenize(normalizedText);

  const location = resolveLocation(tokens);
  const propertyType = resolvePropertyType(tokens);
  const purpose = resolvePurpose(tokens);
  const price = resolvePrice(tokens);
  const rooms = resolveRooms(tokens);

  const claimedRanges = [
    location?.matchedTokenIndexes,
    propertyType?.matchedTokenIndexes,
    purpose?.matchedTokenIndexes,
  ];

  const leftoverKeywords = removeClaimedTokens(tokens, claimedRanges)
    .filter((tok) => tok.length > 1 && !/^\d+$/.test(tok))
    .filter((tok) => !PRICE_STRUCTURAL_WORDS.has(tok) && !ROOM_STRUCTURAL_WORDS.has(tok));

  return {
    rawQuery,
    normalizedText,
    resolvedLocation: location?.locationId || null,
    locationLabel: location?.label || null,
    propertyTypeId: propertyType?.propertyTypeId || null,
    propertyTypeKeywords: propertyType?.keywords || [],
    purpose: purpose?.purposeId || null, // 'rent' | 'sell'
    price: price || null,
    bedrooms: rooms.bedrooms?.value || null,
    bathrooms: rooms.bathrooms?.value || null,
    leftoverKeywords,
    debug: { location, propertyType, purpose, price, rooms },
  };
}

/**
 * Executes the smart search end-to-end and returns paginated listings.
 */
export async function smartSearch(rawQuery, { page = 1, limit = 20 } = {}) {
  const intent = resolveSearchIntent(rawQuery);
  const pipeline = buildSearchPipeline(intent, { page, limit });

  const [results, totalCountResult] = await Promise.all([
    Listing.aggregate(pipeline),
    Listing.aggregate([{ $match: pipeline[0].$match }, { $count: 'total' }]),
  ]);

  const total = totalCountResult[0]?.total || 0;

  return {
    query: rawQuery,
    intent: {
      location: intent.locationLabel,
      propertyType: intent.propertyTypeId,
      purpose: intent.purpose,
      price: intent.price,
      bedrooms: intent.bedrooms,
      bathrooms: intent.bathrooms,
      keywords: intent.leftoverKeywords,
    },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    results,
  };
}
