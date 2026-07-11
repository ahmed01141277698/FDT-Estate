/**
 * textCleaner.js
 * Input -> Normalize -> Clean Text -> Arabic Normalization -> English Normalization
 */

import { normalizeArabic } from './arabicNormalizer.js';
import { normalizeEnglish } from './englishNormalizer.js';

export function basicClean(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u200e\u200f\u202a-\u202e]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanAndNormalize(rawText) {
  const cleaned = basicClean(rawText);
  const arabicNormalized = normalizeArabic(cleaned);
  const fullyNormalized = normalizeEnglish(arabicNormalized);
  return fullyNormalized;
}
