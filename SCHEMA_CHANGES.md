# Schema Patch — `listingModel.js`

This is NOT a replacement file. Below is the **exact diff** to apply to your
real `listingModel.js`. Every existing field, the `mongoose.model(...)` call,
and the `export default` stay untouched.

## 1. Add 3 fields (insert right before the closing `}` of the schema fields, i.e. right after `userRef`)

```js
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // ---- Smart Search additions (do not remove existing fields above) ----
        searchKeywords: {
            type: [String],
            default: [],
            index: true,
        },
        resolvedLocation: {
            type: String,
            default: null,
            index: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
```

*(No `propertyType` field is added, per your decision — property type is
matched entirely through `searchKeywords`.)*

## 2. Add indexes + the auto-keyword hook (insert after the schema is defined, before `const Listing = mongoose.model(...)`)

```js
import { generateListingSearchData } from "../searchEngine/utils/keywordGenerator.js";

// ---- Smart Search indexes ----
ListingSchema.index({ resolvedLocation: 1, type: 1 });
ListingSchema.index({ type: 1, price: 1 });
ListingSchema.index({ featured: -1, createdAt: -1 });

// ---- Auto-generates searchKeywords + resolvedLocation on create/save ----
ListingSchema.pre("save", function (next) {
    const relevantFieldsChanged = ["name", "description", "address"].some((f) =>
        this.isModified(f)
    );

    if (this.isNew || relevantFieldsChanged) {
        const { searchKeywords, resolvedLocation } = generateListingSearchData({
            name: this.name,
            description: this.description,
            address: this.address,
        });
        this.searchKeywords = searchKeywords;
        this.resolvedLocation = resolvedLocation;
    }
    next();
});

// ---- IMPORTANT: your updateListing controller uses findByIdAndUpdate,
// which SKIPS the 'save' hook above. This hook covers that case so search
// results stay in sync after an edit. ----
ListingSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    const touchesRelevantField = ["name", "description", "address"].some(
        (f) => update[f] !== undefined || update.$set?.[f] !== undefined
    );

    if (!touchesRelevantField) return next();

    const existing = await this.model.findOne(this.getQuery());
    if (!existing) return next();

    const merged = {
        name: update.name ?? update.$set?.name ?? existing.name,
        description: update.description ?? update.$set?.description ?? existing.description,
        address: update.address ?? update.$set?.address ?? existing.address,
    };

    const { searchKeywords, resolvedLocation } = generateListingSearchData(merged);
    this.setUpdate({ ...update, searchKeywords, resolvedLocation });
    next();
});
```

## 3. Nothing else changes

`const Listing = mongoose.model("Listing", ListingSchema); export default Listing;`
stays exactly as-is.

## Why each piece is needed

| Addition | Why |
|---|---|
| `searchKeywords` | Pre-computed at write time so search never runs regex against `name`/`description`/`address` at query time — just an indexed `$in`. |
| `resolvedLocation` | Since you don't have a `city` field, this stores which internal-dictionary location was detected in the address, so location filtering is a fast indexed equality check instead of text scanning. |
| `featured` | Per your choice — lets ranking boost featured listings later. Defaults to `false`, so nothing breaks for existing documents. |
| `pre('save')` hook | Populates the two new fields automatically on `Listing.create()` — your `createListing` controller needs zero changes. |
| `pre('findOneAndUpdate')` hook | Your `updateListing` controller calls `findByIdAndUpdate`, which bypasses `save` middleware entirely. Without this second hook, editing a listing's title/address would silently leave stale search data behind. |
| Indexes | `resolvedLocation + type` and `type + price` cover the most common filter combinations; `featured + createdAt` speeds up the ranking sort. |

## One-time backfill for existing listings

Existing documents won't have `searchKeywords`/`resolvedLocation` until they're
next saved. Run this once after applying the patch:

```js

import Listing from "./Models/listingModel.js";
import { generateListingSearchData } from "./searchEngine/utils/keywordGenerator.js";

async function backfill() {
  const listings = await Listing.find({});
  for (const listing of listings) {
    const { searchKeywords, resolvedLocation } = generateListingSearchData(listing);
    listing.searchKeywords = searchKeywords;
    listing.resolvedLocation = resolvedLocation;
    await listing.save({ validateBeforeSave: false });
  }
  console.log(`Backfilled ${listings.length} listings.`);
}
```
