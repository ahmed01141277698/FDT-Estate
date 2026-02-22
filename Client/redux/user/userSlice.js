import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,   
    reducers: {
        signInstart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; 
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        }   
    }

});



export const { signInstart, signInSuccess, signInFailure, signOut } = userSlice.actions;

export default userSlice.reducer;   