# TODO - Smart Search Architecture Upgrade

## Step 1: Repo understanding (done)
- Reviewed Express app routing & middleware mounting.
- Reviewed `smartSearch` pipeline (resolve intent -> build pipeline -> aggregate).
- Reviewed `Listing` schema fields & pre-save / pre-findOneAndUpdate hooks.

## Step 2: Identify gaps / performance risks (to do)
- Validate routing path consistency (`/api/listing/search`).
- Review rankingService usage (ensure not dead/unneeded).
- Inspect remaining search-engine modules for normalization quality, keyword generation, tokenizer behavior.

## Step 3: Implement “high intelligence” improvements (to do)
- Add caching of resolved intent + pipeline by normalized query.
- Strengthen fuzzy matching for Arabic/typos (Levenshtein / n-grams) using precomputed keywords.
- Add stable pagination totalCount query correctness.
- Ensure indexes cover aggregation matchStage fields.

## Step 4: Add observability (to do)
- Add timing logs for each stage of resolve/build/aggregate.
- Add debug flag to return intent + top keywords.

## Step 5: Testing & verification (to do)
- Add integration tests for key queries.
- Add local script to run pipeline on sample queries.

