/**
 * propertyTypeDictionary.js
 *
 * Since your Listing schema has no `propertyType` field, this dictionary's
 * job is purely to expand a matched property type into ALL its aliases
 * (Arabic + English), so those aliases can be injected into `searchKeywords`
 * — both when a listing is created (write time) and when a search is run
 * (query time). That's what lets "villa" and "فيلا" match the same listing.
 */

import { cleanAndNormalize } from '../normalize/textCleaner.js';

const RAW_PROPERTY_TYPES = [
  { id: 'apartment', aliases: ['شقة', 'شقه', 'apartment', 'flat'] },
  { id: 'studio', aliases: ['استوديو', 'ستوديو', 'studio'] },
  { id: 'villa', aliases: ['فيلا', 'فله', 'villa'] },
  { id: 'duplex', aliases: ['دوبلكس', 'duplex'] },
  { id: 'townhouse', aliases: ['تاون هاوس', 'townhouse', 'town house'] },
  { id: 'penthouse', aliases: ['بنتهاوس', 'penthouse'] },
  { id: 'house', aliases: ['منزل', 'بيت', 'house'] },
  { id: 'office', aliases: ['مكتب', 'اداري', 'office'] },
  { id: 'shop', aliases: ['محل', 'محل تجاري', 'shop', 'store'] },
  { id: 'land', aliases: ['ارض', 'قطعه ارض', 'land', 'plot'] },
  { id: 'commercial', aliases: ['تجاري', 'commercial'] },
];

export const PROPERTY_TYPES = RAW_PROPERTY_TYPES.map((pt) => ({
  ...pt,
  normalizedAliases: [...new Set(pt.aliases.map((a) => cleanAndNormalize(a)))],
}));

export const ALIAS_INDEX = PROPERTY_TYPES.flatMap((pt) =>
  pt.normalizedAliases.map((alias) => ({ alias, propertyTypeId: pt.id })),
);

export function getPropertyTypeById(id) {
  return PROPERTY_TYPES.find((pt) => pt.id === id) || null;
}
