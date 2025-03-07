import { configureStore } from "@reduxjs/toolkit";
import homePageReducer from "./HomePageState/homePageSlice";
import loadMoviesReducer from "./loadMoviesState/loadMoviesSlice";
import loadActorsReducer from "./loadActorsState/loadActorsSlice";
import fullWebAccessReducer from "./fullWebAccessState/fullWebAccessSlice"

export const store = configureStore({
    reducer: {
        fullWebAccessState: fullWebAccessReducer,
        homePage: homePageReducer,
        loadMovies: loadMoviesReducer,
        loadActors: loadActorsReducer
    },
});
