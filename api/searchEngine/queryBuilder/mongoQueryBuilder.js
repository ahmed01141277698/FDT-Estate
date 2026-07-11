/**
 * mongoQueryBuilder.js
 *
 * Builds the $match filter + relevance-scored aggregation pipeline.
 *
 * Field mapping to your real schema:
 *  - purpose        -> `type` field ('rent' | 'sell')
 *  - propertyType   -> NO dedicated field. Matched via `searchKeywords`
 *                      using a separate $in clause (see propertyTypeKeywords)
 *  - location       -> `resolvedLocation` field (added)
 *  - price/bedrooms/bathrooms -> your existing fields, used as-is
 *  - featured       -> added field, used for ranking boost only
 *
 * Each resolved "concept" (location, property type, leftover keywords) gets
 * its own $in clause combined with $and, so a search is required to match
 * EVERY concept (AND), while still allowing ANY synonym within a concept
 * (OR) - e.g. must match {فيلا OR villa} AND must match {location alias}.
 */

function buildMatchStage(intent) {
  const match = {};
  const andClauses = [];

  if (intent.resolvedLocation) {
    match.resolvedLocation = intent.resolvedLocation;
  }

  if (intent.purpose) {
    match.type = intent.purpose; // 'rent' | 'sell'
  }

  if (intent.bedrooms) {
    match.bedrooms = intent.bedrooms;
  }

  if (intent.bathrooms) {
    match.bathrooms = intent.bathrooms;
  }

  if (intent.price) {
    if (intent.price.type === 'range') {
      match.price = { $gte: intent.price.min, $lte: intent.price.max };
    } else if (intent.price.type === 'max') {
      match.price = { $lte: intent.price.value };
    } else if (intent.price.type === 'min') {
      match.price = { $gte: intent.price.value };
    } else if (intent.price.type === 'exact') {
      const tolerance = intent.price.value * 0.1;
      match.price = { $gte: intent.price.value - tolerance, $lte: intent.price.value + tolerance };
    }
  }

  // Property type has no dedicated field - require at least one alias match
  // in searchKeywords (its own AND-clause, independent of other keywords).
  if (intent.propertyTypeKeywords && intent.propertyTypeKeywords.length > 0) {
    andClauses.push({ searchKeywords: { $in: intent.propertyTypeKeywords } });
  }

  // Any remaining free-text keywords - also required, but as its own group.
  if (intent.leftoverKeywords && intent.leftoverKeywords.length > 0) {
    andClauses.push({ searchKeywords: { $in: intent.leftoverKeywords } });
  }

  if (andClauses.length > 0) {
    match.$and = andClauses;
  }

  return match;
}

function buildSearchPipeline(intent, { page = 1, limit = 20 } = {}) {
  const matchStage = buildMatchStage(intent);
  const scoreExpressions = [];

  if (intent.resolvedLocation) {
    scoreExpressions.push({ $cond: [{ $eq: ['$resolvedLocation', intent.resolvedLocation] }, 30, 0] });
  }

  if (intent.purpose) {
    scoreExpressions.push({ $cond: [{ $eq: ['$type', intent.purpose] }, 10, 0] });
  }

  if (intent.propertyTypeKeywords && intent.propertyTypeKeywords.length > 0) {
    scoreExpressions.push({
      $cond: [
        { $gt: [{ $size: { $setIntersection: ['$searchKeywords', intent.propertyTypeKeywords] } }, 0] },
        20,
        0,
      ],
    });
  }

  if (intent.leftoverKeywords && intent.leftoverKeywords.length > 0) {
    scoreExpressions.push({
      $multiply: [{ $size: { $setIntersection: ['$searchKeywords', intent.leftoverKeywords] } }, 5],
    });
  }

  scoreExpressions.push({ $cond: ['$featured', 15, 0] });

  return [
    { $match: matchStage },
    { $addFields: { relevanceScore: scoreExpressions.length > 0 ? { $add: scoreExpressions } : 0 } },
    { $sort: { relevanceScore: -1, featured: -1, createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];
}

export { buildMatchStage, buildSearchPipeline };
