// homepageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadActorsPathname: '/',
    isAllDataLoad: false,
    loadActorsData: [],
};

export const loadActorsSlice = createSlice({
    name: 'loadactors',
    initialState,
    reducers: {
        updateLoadActors: (state, action) => {
            const updatedData = { ...state, ...action.payload}
           return updatedData;
        },
    },
});

export const { updateLoadActors } = loadActorsSlice.actions;

export default loadActorsSlice.reducer;
