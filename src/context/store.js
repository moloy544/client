import { configureStore } from "@reduxjs/toolkit";
import loadMoviesReducer from "./loadMoviesState/loadMoviesSlice";
import homePageReducer from "./HomePageState/homePageSlice";

export const store = configureStore({
    reducer: {
        homePage: homePageReducer,
        loadMovies: loadMoviesReducer
    },
});
