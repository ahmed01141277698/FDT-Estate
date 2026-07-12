/**
 * locationResolver.js — exact match then Levenshtein fuzzy match against
 * the internal Location Dictionary. No external geocoding API.
 */

import { ALIAS_INDEX, getLocationById } from '../dictionary/locationDictionary.js';
import { buildNGrams } from '../../utils/tokenizer.js';
import { isFuzzyMatch, similarityRatio } from '../../utils/levenshtein.js';

const EXACT_ALIAS_MAP = new Map(ALIAS_INDEX.map((entry) => [entry.alias, entry.locationId]));
const MIN_FUZZY_SIMILARITY = 0.72;
const MIN_NGRAM_LENGTH_FOR_FUZZY = 3;

export function resolveLocation(tokens) {
  if (!tokens || tokens.length === 0) return null;

  const ngrams = buildNGrams(tokens, 3);

  for (const ngram of ngrams) {
    const locationId = EXACT_ALIAS_MAP.get(ngram.text);
    if (locationId) {
      const location = getLocationById(locationId);
      return {
        locationId,
        label: location.label,
        labelEn: location.labelEn,
        matchedText: ngram.text,
        matchedTokenIndexes: [ngram.startIndex, ngram.startIndex + ngram.size - 1],
        confidence: 1,
      };
    }
  }

  let best = null;
  for (const ngram of ngrams) {
    if (ngram.text.length < MIN_NGRAM_LENGTH_FOR_FUZZY) continue;
    for (const { alias, locationId } of ALIAS_INDEX) {
      if (!isFuzzyMatch(ngram.text, alias)) continue;
      const score = similarityRatio(ngram.text, alias);
      if (score >= MIN_FUZZY_SIMILARITY && (!best || score > best.confidence)) {
        best = {
          locationId,
          matchedText: ngram.text,
          matchedTokenIndexes: [ngram.startIndex, ngram.startIndex + ngram.size - 1],
          confidence: score,
        };
      }
    }
  }

  if (!best) return null;
  const location = getLocationById(best.locationId);
  return {
    locationId: best.locationId,
    label: location.label,
    labelEn: location.labelEn,
    matchedText: best.matchedText,
    matchedTokenIndexes: best.matchedTokenIndexes,
    confidence: best.confidence,
  };
}
