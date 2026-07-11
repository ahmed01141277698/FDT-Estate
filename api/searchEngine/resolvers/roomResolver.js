/**
 * roomResolver.js — detects bedroom/bathroom counts, e.g. "3 غرف", "3 bedrooms".
 * These filter directly on your existing `bedrooms` / `bathrooms` fields.
 */

const BEDROOM_WORDS = ['غرفه', 'غرف', 'اوضه', 'اوض', 'bedroom', 'bedrooms', 'bed', 'beds'];
const BATHROOM_WORDS = ['حمام', 'حمامات', 'bathroom', 'bathrooms', 'bath', 'baths'];

function findCountBeforeKeyword(tokens, keywordList) {
  for (let i = 0; i < tokens.length; i += 1) {
    if (keywordList.includes(tokens[i])) {
      const prev = tokens[i - 1];
      if (prev && /^\d+$/.test(prev)) {
        return { value: parseInt(prev, 10), matchedText: `${prev} ${tokens[i]}` };
      }
      const next = tokens[i + 1];
      if (next && /^\d+$/.test(next)) {
        return { value: parseInt(next, 10), matchedText: `${tokens[i]} ${next}` };
      }
    }
  }
  return null;
}

export function resolveRooms(tokens) {
  if (!tokens || tokens.length === 0) return { bedrooms: null, bathrooms: null };
  return {
    bedrooms: findCountBeforeKeyword(tokens, BEDROOM_WORDS),
    bathrooms: findCountBeforeKeyword(tokens, BATHROOM_WORDS),
  };
}

export const ROOM_STRUCTURAL_WORDS = new Set([...BEDROOM_WORDS, ...BATHROOM_WORDS]);
