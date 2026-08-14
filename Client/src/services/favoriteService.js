import {
  favoritesRequestStart,
  favoritesRequestSuccess,
  favoritesRequestFailure,
} from "../../redux/favoriteSlice/favoriteSlice";

export const loadFavorites = () => async (dispatch) => {
  try {
    dispatch(favoritesRequestStart());

    const token = localStorage.getItem("token");

    const res = await fetch(
      "/api/listing/favorites",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    dispatch(
      favoritesRequestSuccess(
        data.listings || []
      )
    );
  } catch (error) {
    dispatch(
      favoritesRequestFailure(
        error.message
      )
    );
  }
};