import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user/userSlice';
export const store = configureStore({
    reducer: {
user:userSlice,
    },
    // The middleware option is used to customize the middleware that Redux applies to the store. In this case, we are using getDefaultMiddleware to get the default middleware provided by Redux Toolkit and then disabling the serializableCheck. The serializableCheck is a middleware that checks if the actions and state are serializable, which can help catch bugs related to non-serializable data. However, in some cases, you might want to disable this check, especially if you are working with non-serializable data or if you have specific reasons for doing so. By setting serializableCheck to false, you are telling Redux Toolkit not to perform this check, which can be useful in certain scenarios but should be done with caution to avoid potential issues with non-serializable data in your state or actions.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})