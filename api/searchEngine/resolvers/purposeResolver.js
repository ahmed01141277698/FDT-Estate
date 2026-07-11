/**
 * purposeResolver.js — resolves to 'sell' | 'rent', matching your `type` field.
 * Exact match only (no fuzzy) - purpose words are short, fuzzy matching them
 * risks false positives.
 */

import { ALIAS_INDEX } from '../dictionary/purposeDictionary.js';
import { buildNGrams } from '../utils/tokenizer.js';

const EXACT_ALIAS_MAP = new Map(ALIAS_INDEX.map((e) => [e.alias, e.purposeId]));

export function resolvePurpose(tokens) {
  if (!tokens || tokens.length === 0) return null;

  const ngrams = buildNGrams(tokens, 2);

  for (const ngram of ngrams) {
    const purposeId = EXACT_ALIAS_MAP.get(ngram.text);
    if (purposeId) {
      return {
        purposeId, // 'sell' | 'rent' - matches your Listing `type` enum directly
        matchedText: ngram.text,
        matchedTokenIndexes: [ngram.startIndex, ngram.startIndex + ngram.size - 1],
        confidence: 1,
      };
    }
  }
  return null;
}
