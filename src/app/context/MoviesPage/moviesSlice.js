const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    loading: false,
    pageLimit: 30,
    moviesData: [],
    endOfData: false,
    isDataFetched: false,
};

const moviesSlice = createSlice({
    name: 'movies state',
    initialState,
    reducers: {
        updateMoviesState: (state, action) => {
          
          const updatedState = { ...state, ...action.payload }; 
            
          return updatedState;
        },
    
      },
});

export const { updateMoviesState } = moviesSlice.actions;

export default moviesSlice.reducer;