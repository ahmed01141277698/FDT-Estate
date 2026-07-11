/**
 * englishNormalizer.js
 * Lowercase, collapse hyphens/underscores to spaces, strip punctuation.
 */

export function normalizeEnglish(text) {
  if (!text) return '';
  let result = text.toLowerCase();
  result = result.replace(/[-_/]+/g, ' ');
  result = result.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}
