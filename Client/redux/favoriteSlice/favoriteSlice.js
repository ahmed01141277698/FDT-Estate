import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  favoritesIds: [],
  count: 0,
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,

  reducers: {
    favoritesRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    favoritesRequestSuccess: (state, action) => {
      state.loading = false;

      state.items = action.payload || [];

      state.favoritesIds = action.payload.map(
        (item) => item._id
      );

      state.count = action.payload.length;
    },

    favoritesRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    toggleFavoriteLocal: (state, action) => {
      const listingId = action.payload;

      const exists = state.favoritesIds.includes(
        listingId
      );

      if (exists) {
        state.favoritesIds = state.favoritesIds.filter(
          (id) => id !== listingId
        );

        state.items = state.items.filter(
          (item) => item._id !== listingId
        );

        state.count = Math.max(0, state.count - 1);
      } else {
        state.favoritesIds.push(listingId);
        state.count += 1;
      }
    },
  },
});

export const {
  favoritesRequestStart,
  favoritesRequestSuccess,
  favoritesRequestFailure,
  toggleFavoriteLocal,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;