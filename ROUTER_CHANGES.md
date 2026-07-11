# Router Patch — `listingRouter.js`

Two-line addition to your existing router. Nothing else in the file changes.

```diff
 import express from 'express';
 import { createListing, getUserListings, getListingById, updateListing, deleteListing , detailsListing} from '../Controlles/listingControll.js';
 import { verifyToken } from '../Middleware/authMiddleware.js';
+import { smartSearchListings } from '../Controlles/searchController.js';

 const ListingRouter = express.Router();

+ListingRouter.get('/search', smartSearchListings); // put this BEFORE '/:id' below
 ListingRouter.post('/createListing', verifyToken, createListing);
 ListingRouter.get('/details/:id', verifyToken, detailsListing);
 ListingRouter.get('/user/:id', verifyToken, getUserListings);
 ListingRouter.get('/:id', verifyToken, getListingById);
 ListingRouter.put('/:id', verifyToken, updateListing);
 ListingRouter.delete('/:id', verifyToken, deleteListing);
 export default ListingRouter;
```

## Why `/search` must be placed before `/:id`

Express matches routes top-to-bottom. Your existing `router.get('/:id', ...)`
would otherwise treat `/search` as if `"search"` were an `:id` and try to run
`getListingById` with `id = "search"` — a 404/cast error. Placing `/search`
above it avoids that without touching the `/:id` route itself.

## `verifyToken` was intentionally left off `/search`

Search is read-only and typically public-facing (visitors search before
logging in). If you want search restricted to authenticated users instead,
add `verifyToken` the same way the other routes use it:

```js
ListingRouter.get('/search', verifyToken, smartSearchListings);
```
