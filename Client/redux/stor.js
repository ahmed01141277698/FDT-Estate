import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import favoriteReducer from "./favoriteSlice/favoriteSlice";
const rootReducer = combineReducers({
    user: userReducer,
    favorites: favoriteReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});