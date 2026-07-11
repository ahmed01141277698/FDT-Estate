/**
 * keywordGenerator.js
 *
 * Builds the `searchKeywords` array stored on each Listing automatically -
 * no manual keyword entry required. Sources: name, description, address,
 * plus two "expansions":
 *
 *  1. Location expansion: if a location is detected in address/name, every
 *     alias of that location (AR + EN) is added, so "زايد" finds a listing
 *     whose address only ever said "الشيخ زايد".
 *
 *  2. Property type expansion: since your schema has no `propertyType`
 *     field, the same trick is applied here - if "فيلا" or "villa" is
 *     detected in name/description, ALL aliases of that property type are
 *     added to searchKeywords. This is what lets a search for "Villa" match
 *     a listing whose title only says "فيلا", and vice versa.
 */

import { cleanAndNormalize } from '../normalize/textCleaner.js';
import { tokenize } from './tokenizer.js';
import { resolveLocation } from '../resolvers/locationResolver.js';
import { getLocationById } from '../dictionary/locationDictionary.js';
import { resolvePropertyType } from '../resolvers/propertyResolver.js';

const STOPWORDS = new Set([
  'في', 'من', 'الى', 'إلى', 'على', 'مع', 'او', 'أو', 'و',
  'the', 'a', 'an', 'in', 'on', 'at', 'for', 'and', 'or', 'with',
]);

function extractKeywordsFromText(text) {
  const normalized = cleanAndNormalize(text);
  return tokenize(normalized).filter((tok) => tok.length > 1 && !STOPWORDS.has(tok));
}

/**
 * @param {Object} listing
 * @param {string} listing.name         - your schema's title field
 * @param {string} listing.description
 * @param {string} listing.address
 * @returns {{ searchKeywords: string[], resolvedLocation: string|null }}
 */
export function generateListingSearchData(listing) {
  const { name, description, address } = listing;

  const keywordSet = new Set();

  [name, description, address].forEach((field) => {
    if (!field) return;
    extractKeywordsFromText(field).forEach((word) => keywordSet.add(word));
  });

  // --- Location expansion ---
  const addressTokens = tokenize(cleanAndNormalize(`${address || ''} ${name || ''}`));
  const locationMatch = resolveLocation(addressTokens);

  let resolvedLocation = null;
  if (locationMatch && locationMatch.confidence >= 0.8) {
    resolvedLocation = locationMatch.locationId;
    const location = getLocationById(resolvedLocation);
    location.normalizedAliases.forEach((alias) => {
      alias.split(' ').forEach((word) => keywordSet.add(word));
    });
  }

  // --- Property type expansion (no dedicated field, so this matters more) ---
  const nameDescTokens = tokenize(cleanAndNormalize(`${name || ''} ${description || ''}`));
  const propertyTypeMatch = resolvePropertyType(nameDescTokens);
  if (propertyTypeMatch && propertyTypeMatch.confidence >= 0.8) {
    propertyTypeMatch.keywords.forEach((word) => keywordSet.add(word));
  }

  return {
    searchKeywords: [...keywordSet],
    resolvedLocation,
  };
}
