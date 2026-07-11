/**
 * levenshtein.js — edit distance for typo tolerance.
 */

export function levenshteinDistance(a = '', b = '') {
  if (a === b) return 0;
  const lenA = a.length;
  const lenB = b.length;
  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  let previousRow = new Array(lenB + 1);
  for (let j = 0; j <= lenB; j += 1) previousRow[j] = j;

  for (let i = 1; i <= lenA; i += 1) {
    const currentRow = [i];
    for (let j = 1; j <= lenB; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[j] = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + cost,
      );
    }
    previousRow = currentRow;
  }
  return previousRow[lenB];
}

export function similarityRatio(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

export function isFuzzyMatch(a, b, { maxDistance } = {}) {
  const distance = levenshteinDistance(a, b);
  const threshold = maxDistance ?? Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
  return distance <= threshold;
}
