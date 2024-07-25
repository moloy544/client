// homepageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sliderMovies: [],
    sliderActors: [],
    isAllLoad: false,
};

export const homePageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        updateHomePageState: (state, action) => {
            const updatedData = { ...state, ...action.payload }
            return updatedData;
        },
    },
});

export const { updateHomePageState } = homePageSlice.actions;

export default homePageSlice.reducer;
