/**
 * propertyResolver.js
 *
 * Resolves free-text tokens to a canonical propertyType id AND returns
 * that type's full alias list (`keywords`) - since your schema has no
 * `propertyType` field, the query builder uses `keywords` to filter via
 * `searchKeywords` instead of a dedicated field match.
 */

import { ALIAS_INDEX, getPropertyTypeById } from '../dictionary/propertyTypeDictionary.js';
import { buildNGrams } from '../utils/tokenizer.js';
import { isFuzzyMatch, similarityRatio } from '../utils/levenshtein.js';

const EXACT_ALIAS_MAP = new Map(ALIAS_INDEX.map((e) => [e.alias, e.propertyTypeId]));
const MIN_FUZZY_SIMILARITY = 0.75;

function buildResult(propertyTypeId, matchedText, matchedTokenIndexes, confidence) {
  const propertyType = getPropertyTypeById(propertyTypeId);
  return {
    propertyTypeId,
    matchedText,
    matchedTokenIndexes,
    confidence,
    // full bilingual alias list - e.g. ['فيلا', 'فله', 'villa']
    keywords: propertyType.normalizedAliases.flatMap((a) => a.split(' ')),
  };
}

export function resolvePropertyType(tokens) {
  if (!tokens || tokens.length === 0) return null;

  const ngrams = buildNGrams(tokens, 2);

  for (const ngram of ngrams) {
    const propertyTypeId = EXACT_ALIAS_MAP.get(ngram.text);
    if (propertyTypeId) {
      return buildResult(
        propertyTypeId,
        ngram.text,
        [ngram.startIndex, ngram.startIndex + ngram.size - 1],
        1,
      );
    }
  }

  let best = null;
  for (const ngram of ngrams) {
    if (ngram.text.length < 3) continue;
    for (const { alias, propertyTypeId } of ALIAS_INDEX) {
      if (!isFuzzyMatch(ngram.text, alias)) continue;
      const score = similarityRatio(ngram.text, alias);
      if (score >= MIN_FUZZY_SIMILARITY && (!best || score > best.confidence)) {
        best = {
          propertyTypeId,
          matchedText: ngram.text,
          matchedTokenIndexes: [ngram.startIndex, ngram.startIndex + ngram.size - 1],
          confidence: score,
        };
      }
    }
  }

  if (!best) return null;
  return buildResult(best.propertyTypeId, best.matchedText, best.matchedTokenIndexes, best.confidence);
}
