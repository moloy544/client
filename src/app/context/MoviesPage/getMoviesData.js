import { useSelector } from "react-redux"

export const getMoviesData = ()=>{
    const moviesData = useSelector((state)=> state.movies);
    return moviesData;
};