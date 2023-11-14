import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./MoviesPage/moviesSlice";

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
    },
});
