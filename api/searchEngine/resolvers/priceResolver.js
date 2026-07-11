/**
 * priceResolver.js — numbers, مليون/million/m, thousand/k, spelled-out Arabic
 * numbers 1-10, comparators (اقل من/less than, اكثر من/more than), and ranges
 * (بين X و Y / between X and Y).
 */

const SPELLED_NUMBERS_AR = {
  واحد: 1, اثنين: 2, ثلاثه: 3, اربعه: 4, خمسه: 5,
  سته: 6, سبعه: 7, ثمانيه: 8, تسعه: 9, عشره: 10,
};

const MILLION_WORDS = ['مليون', 'million'];
const THOUSAND_WORDS = ['الف', 'thousand'];
const LESS_THAN_PHRASES = ['اقل من', 'أقل من', 'less than', 'under', 'below', 'up to'];
const MORE_THAN_PHRASES = ['اكثر من', 'أكثر من', 'more than', 'above', 'over'];
const BETWEEN_MARKERS_AR = ['بين'];
const BETWEEN_MARKERS_EN = ['between'];

function numberTokenToValue(token) {
  if (/^\d+$/.test(token)) return parseInt(token, 10);
  if (SPELLED_NUMBERS_AR[token] !== undefined) return SPELLED_NUMBERS_AR[token];
  return null;
}

function parseMagnitudeNumber(tokens, startIndex) {
  const token = tokens[startIndex];
  if (token === undefined) return null;

  const compactMatch = token.match(/^(\d+(?:\.\d+)?)(m|million|k|thousand)$/);
  if (compactMatch) {
    const base = parseFloat(compactMatch[1]);
    const suffix = compactMatch[2];
    const multiplier = suffix === 'm' || suffix === 'million' ? 1_000_000 : 1_000;
    return { value: Math.round(base * multiplier), endIndex: startIndex, matchedText: token };
  }

  const numericBase = numberTokenToValue(token);
  if (numericBase === null) return null;

  const nextToken = tokens[startIndex + 1];
  if (nextToken && MILLION_WORDS.includes(nextToken)) {
    return { value: numericBase * 1_000_000, endIndex: startIndex + 1, matchedText: `${token} ${nextToken}` };
  }
  if (nextToken && THOUSAND_WORDS.includes(nextToken)) {
    return { value: numericBase * 1_000, endIndex: startIndex + 1, matchedText: `${token} ${nextToken}` };
  }
  return { value: numericBase, endIndex: startIndex, matchedText: token };
}

function containsPhraseAt(tokens, startIndex, phrase) {
  const phraseTokens = phrase.split(' ');
  for (let i = 0; i < phraseTokens.length; i += 1) {
    if (tokens[startIndex + i] !== phraseTokens[i]) return false;
  }
  return true;
}

function findPhraseIndex(tokens, phrases) {
  for (let i = 0; i < tokens.length; i += 1) {
    for (const phrase of phrases) {
      if (containsPhraseAt(tokens, i, phrase)) {
        return { index: i, length: phrase.split(' ').length };
      }
    }
  }
  return null;
}

export function resolvePrice(tokens) {
  if (!tokens || tokens.length === 0) return null;

  const betweenMatch = findPhraseIndex(tokens, [...BETWEEN_MARKERS_AR, ...BETWEEN_MARKERS_EN]);
  if (betweenMatch) {
    const afterBetween = betweenMatch.index + betweenMatch.length;
    const first = parseMagnitudeNumber(tokens, afterBetween);
    if (first) {
      let cursor = first.endIndex + 1;
      const connector = tokens[cursor];
      if (connector === 'و' || connector === 'and') cursor += 1;
      const second = parseMagnitudeNumber(tokens, cursor);
      if (second) {
        let minValue = first.value;
        const firstHadMagnitude = /مليون|million|الف|thousand|m$|k$/.test(first.matchedText);
        const secondHadMagnitude = /مليون|million|الف|thousand/.test(second.matchedText);
        if (!firstHadMagnitude && secondHadMagnitude) {
          const magnitude = /مليون|million/.test(second.matchedText) ? 1_000_000 : 1_000;
          minValue = first.value * magnitude;
        }
        return {
          type: 'range',
          min: Math.min(minValue, second.value),
          max: Math.max(minValue, second.value),
          matchedText: `${betweenMatch.index}..${second.endIndex}`,
        };
      }
    }
  }

  const lessThanMatch = findPhraseIndex(tokens, LESS_THAN_PHRASES);
  if (lessThanMatch) {
    const parsed = parseMagnitudeNumber(tokens, lessThanMatch.index + lessThanMatch.length);
    if (parsed) return { type: 'max', value: parsed.value, matchedText: parsed.matchedText };
  }

  const moreThanMatch = findPhraseIndex(tokens, MORE_THAN_PHRASES);
  if (moreThanMatch) {
    const parsed = parseMagnitudeNumber(tokens, moreThanMatch.index + moreThanMatch.length);
    if (parsed) return { type: 'min', value: parsed.value, matchedText: parsed.matchedText };
  }

  for (let i = 0; i < tokens.length; i += 1) {
    const parsed = parseMagnitudeNumber(tokens, i);
    if (parsed && parsed.value >= 1000) {
      return { type: 'exact', value: parsed.value, matchedText: parsed.matchedText };
    }
  }

  return null;
}

// Exposed so searchService can strip these "structural" words out of the
// leftover keyword list - already consumed by this resolver.
export const PRICE_STRUCTURAL_WORDS = new Set([
  ...MILLION_WORDS,
  ...THOUSAND_WORDS,
  ...LESS_THAN_PHRASES.flatMap((p) => p.split(' ')),
  ...MORE_THAN_PHRASES.flatMap((p) => p.split(' ')),
  ...BETWEEN_MARKERS_AR,
  ...BETWEEN_MARKERS_EN,
  'و',
  'and',
  ...Object.keys(SPELLED_NUMBERS_AR),
]);
