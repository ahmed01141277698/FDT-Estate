/**
 * purposeDictionary.js
 *
 * IDs here ('sell' / 'rent') are chosen to exactly match your existing
 * Listing schema's `type` enum: enum: ['rent', 'sell']. This is the one
 * dictionary whose output maps straight to an existing field - no new
 * field needed for purpose.
 */

import { cleanAndNormalize } from '../normalize/textCleaner.js';

const RAW_PURPOSES = [
  { id: 'sell', aliases: ['بيع', 'للبيع', 'شراء', 'اشتري', 'buy', 'sale', 'for sale', 'sell'] },
  { id: 'rent', aliases: ['ايجار', 'إيجار', 'للايجار', 'للإيجار', 'rent', 'for rent', 'rental'] },
];

export const PURPOSES = RAW_PURPOSES.map((p) => ({
  ...p,
  normalizedAliases: [...new Set(p.aliases.map((a) => cleanAndNormalize(a)))],
}));

export const ALIAS_INDEX = PURPOSES.flatMap((p) =>
  p.normalizedAliases.map((alias) => ({ alias, purposeId: p.id })),
);
