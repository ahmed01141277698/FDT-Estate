/**
 * locationDictionary.js — internal location knowledge base (no external API).
 * Extend by pushing a new object into RAW_LOCATIONS; no other code changes needed.
 */

import { cleanAndNormalize } from '../normalize/textCleaner.js';

const RAW_LOCATIONS = [
  {
    id: 'sheikh_zayed',
    label: 'الشيخ زايد',
    labelEn: 'Sheikh Zayed',
    aliases: [
      'الشيخ زايد', 'شيخ زايد', 'مدينة الشيخ زايد', 'زايد', 'ش ز', 'ش.زايد',
      'sheikh zayed', 'sheikh-zayed', 'zayed', 'zayed city',
    ],
  },
  {
    id: 'fifth_settlement',
    label: 'التجمع الخامس',
    labelEn: 'Fifth Settlement',
    aliases: [
      'التجمع الخامس', 'التجمع', 'التجمع 5', 'التجمع الخمس', 'ت خ',
      'new cairo', 'new-cairo', 'fifth settlement', '5th settlement',
    ],
  },
  {
    id: 'new_capital',
    label: 'العاصمة الإدارية الجديدة',
    labelEn: 'New Administrative Capital',
    aliases: ['العاصمة الادارية', 'العاصمة الجديدة', 'العاصمة', 'new capital', 'new administrative capital', 'nac'],
  },
  {
    id: 'october',
    label: '6 أكتوبر',
    labelEn: '6th of October',
    aliases: ['6 اكتوبر', 'سته اكتوبر', 'اكتوبر', '6th of october', '6 october', 'october city'],
  },
  {
    id: 'maadi',
    label: 'المعادي',
    labelEn: 'Maadi',
    aliases: ['المعادي', 'معادي', 'maadi'],
  },
  {
    id: 'nasr_city',
    label: 'مدينة نصر',
    labelEn: 'Nasr City',
    aliases: ['مدينه نصر', 'مدينة نصر', 'نصر سيتي', 'nasr city', 'nasr'],
  },
  {
    id: 'mokattam',
    label: 'المقطم',
    labelEn: 'Mokattam',
    aliases: ['المقطم', 'مقطم', 'mokattam', 'muqattam'],
  },
  {
    id: 'heliopolis',
    label: 'مصر الجديدة',
    labelEn: 'Heliopolis',
    aliases: ['مصر الجديده', 'مصر الجديدة', 'هليوبوليس', 'heliopolis', 'masr el gedida'],
  },
];

export const LOCATIONS = RAW_LOCATIONS.map((loc) => ({
  ...loc,
  normalizedAliases: [...new Set(loc.aliases.map((a) => cleanAndNormalize(a)))],
}));

export const ALIAS_INDEX = LOCATIONS.flatMap((loc) =>
  loc.normalizedAliases.map((alias) => ({ alias, locationId: loc.id })),
);

export function getLocationById(id) {
  return LOCATIONS.find((loc) => loc.id === id) || null;
}
