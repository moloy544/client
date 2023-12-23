import { configureStore } from "@reduxjs/toolkit";
import loadMoviesReducer from "./loadMoviesState/loadMoviesSlice";

export const store = configureStore({
    reducer: {
        loadMovies: loadMoviesReducer
    },
});
