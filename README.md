# FDT Estate — Smart Search (adapted to your real schema)

This version is adapted specifically to your actual `Listing` model,
controllers, and router — field names, `type` enum, ESM syntax, all matched.
**Nothing in your existing files is replaced.** Two markdown files describe
exact, minimal patches; everything else is new, additive files.

## What to read first

1. **`SCHEMA_CHANGES.md`** — exact diff for `listingModel.js` (3 new fields,
   3 indexes, 2 hooks). Explains *why* each piece is needed, including why
   the `findOneAndUpdate` hook specifically matters for your `updateListing`
   controller.
2. **`ROUTER_CHANGES.md`** — exact 2-line diff for `listingRouter.js`
   (1 import + 1 route, with an explanation of why it must go above `/:id`).

## New files (drop in as-is, nothing to merge)

```
Controlles/searchController.js      # new controller, doesn't touch listingControll.js
searchEngine/                       # the engine itself (framework-agnostic)
├── normalize/    (arabicNormalizer, englishNormalizer, textCleaner)
├── dictionary/   (locationDictionary, propertyTypeDictionary, purposeDictionary)
├── resolvers/    (location, property, purpose, price, room)
├── utils/        (tokenizer, levenshtein, keywordGenerator)
├── queryBuilder/ (mongoQueryBuilder)
├── ranking/      (rankingService)
└── searchService.js                # orchestrates the whole pipeline
```

## Decisions applied from your answers

- **No `propertyType` field added.** Property type matching runs entirely
  through `searchKeywords`. Both at listing-creation time (keywords are
  expanded with every alias of the detected type — "فيلا" also stores
  "villa") and at query time (search also expands to every alias), so
  either language finds the same listings without needing the field.
- **`featured: Boolean` added**, defaults to `false`, used in the ranking
  sort. Existing documents are unaffected until next saved.

## Field mapping used throughout

| Concept | Your field | Notes |
|---|---|---|
| Title | `name` | not `title` |
| Sale/Rent | `type` (`'rent'` \| `'sell'`) | resolver output ids match your enum exactly |
| Location | `resolvedLocation` (new) | derived from `address`, no external API |
| Property type | *(none — via `searchKeywords`)* | see above |
| Bedrooms/bathrooms/price | `bedrooms`, `bathrooms`, `price` | unchanged, used as-is |

## Once you've applied both patches

```
GET /listing/search?q=شقة الشيخ زايد
GET /listing/search?q=فيلا 12 مليون
GET /listing/search?q=اقل من 8 مليون شقة زايد
```
(adjust the base path to wherever `ListingRouter` is mounted in your app)

Run the one-time backfill script in `SCHEMA_CHANGES.md` afterward so
existing listings get `searchKeywords`/`resolvedLocation` populated.
