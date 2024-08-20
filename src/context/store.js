import { configureStore } from "@reduxjs/toolkit";
import homePageReducer from "./HomePageState/homePageSlice";
import loadMoviesReducer from "./loadMoviesState/loadMoviesSlice";
import loadActorsReducer from "./loadActorsState/loadActorsSlice";

export const store = configureStore({
    reducer: {
        homePage: homePageReducer,
        loadMovies: loadMoviesReducer,
        loadActors: loadActorsReducer
    },
});
