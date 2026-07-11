/**
 * arabicNormalizer.js
 * Normalizes Arabic text so different spellings collapse to one canonical form.
 *  - Alef variants:  إ أ آ ٱ -> ا
 *  - Ta marbuta:      ة -> ه
 *  - Alef maksura:    ى -> ي
 *  - Tatweel + tashkeel (diacritics) removed
 *  - Arabic-Indic digits -> Western digits
 */

const DIACRITICS_REGEX = /[\u064B-\u0652\u0670\u0640]/g;
const ARABIC_INDIC_DIGITS = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
};

export function normalizeArabicDigits(text) {
  return text.replace(/[٠-٩]/g, (d) => ARABIC_INDIC_DIGITS[d] || d);
}

export function normalizeAlef(text) {
  return text.replace(/[إأآٱا]/g, 'ا');
}

export function normalizeTaMarbuta(text) {
  return text.replace(/ة/g, 'ه');
}

export function normalizeAlefMaksura(text) {
  return text.replace(/ى/g, 'ي');
}

export function removeDiacritics(text) {
  return text.replace(DIACRITICS_REGEX, '');
}

function removeArabicPunctuation(text) {
  return text.replace(/[،؛؟٫٬"'`«»؛]/g, ' ');
}

export function normalizeArabic(text) {
  if (!text) return '';
  let result = text;
  result = removeDiacritics(result);
  result = normalizeArabicDigits(result);
  result = normalizeAlef(result);
  result = normalizeTaMarbuta(result);
  result = normalizeAlefMaksura(result);
  result = removeArabicPunctuation(result);
  return result;
}
