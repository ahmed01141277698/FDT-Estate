/**
 * tokenizer.js — word splitting + n-grams for phrase matching.
 */

export function tokenize(normalizedText) {
  if (!normalizedText) return [];
  return normalizedText.split(' ').filter(Boolean);
}

export function buildNGrams(tokens, maxWords = 3) {
  const ngrams = [];
  for (let size = Math.min(maxWords, tokens.length); size >= 1; size -= 1) {
    for (let start = 0; start + size <= tokens.length; start += 1) {
      ngrams.push({
        text: tokens.slice(start, start + size).join(' '),
        startIndex: start,
        size,
      });
    }
  }
  return ngrams;
}
