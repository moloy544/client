// fullWebAccessState.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isSocialjoinModalShow: false,
   UserRestrictedChecking: false,
   isUserRestricted: false,
   userRealIp: null,
   homeRedirectOnHistoryBack: false
};

export const fullWebAccessStateSlice = createSlice({
    name: 'fullWebAccessState',
    initialState,
    reducers: {
        updatefullWebAccessState: (state, action) => {
            const updatedData = { ...state, ...action.payload }
            return updatedData;
        },
    },
});

export const { updatefullWebAccessState } = fullWebAccessStateSlice.actions;

export default fullWebAccessStateSlice.reducer;
