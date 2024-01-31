// homepageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadMoviesPathname: '/',
    isAllDataLoad: false,
    loadMoviesData: [],
    filterData:{}
};

export const loadMoviesSlice = createSlice({
    name: 'loadmovies',
    initialState,
    reducers: {
        updateLoadMovies: (state, action) => {
            const updatedData = { ...state, ...action.payload}
           return updatedData;
        },
    },
});

export const { updateLoadMovies } = loadMoviesSlice.actions;

export default loadMoviesSlice.reducer;
