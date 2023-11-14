"use client"
import './css/style.css'
import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { getMoviesData } from "./context/MoviesPage/getMoviesData";
import { updateMoviesState } from "./context/MoviesPage/moviesSlice";
import CategoryGroupSlider from './components/CategoryGroupSlider';
import MoviesCard from './components/MoviesCard';

export default function Movies() {

  const dispatch = useDispatch();

  //initial stste 
  const [limit, setLimit] = useState(20);
  const [totalResult, setTotalResult] = useState(0);

  //Redux movies state
  const { loading, moviesData, isDataFetched, endOfData } = getMoviesData();

  const options = {
    method: 'GET',
    url: 'https://global-movies-api-hub.p.rapidapi.com/movies',
    params: {
      limit: limit,
      offset: '0',
      orderBy: 'createdAt_DESC',
      'filter[ratingRange][0]': '0',
      'filter[ratingRange][1]': '10',
      'filter[yearRange][0]': '1980',
      'filter[yearRange][1]': '2023'
    },
    headers: {
      'X-RapidAPI-Key': '6efb3ec6ffmsh61c0e11f801b31fp104145jsn392cbc630ebd',
      'X-RapidAPI-Host': 'global-movies-api-hub.p.rapidapi.com'
    }
  };

  const fetchMovies = async () => {

    try {

      if (!isDataFetched) {

        dispatch(updateMoviesState({ loading: true }))

        const response = await axios.request(options);

        dispatch(updateMoviesState({ loading: false, isDataFetched: true }));

        if (response.status === 200) {

          const responseData = response.data;

          setTotalResult(responseData.rows.length);

          if (responseData.rows.length !== totalResult) {

              dispatch(updateMoviesState({ moviesData: responseData.rows }));
            }else {
            dispatch(updateMoviesState({ endOfData: true }));
          };

        } else {
          console.log("Server not respponding")
        };
      }

    } catch (error) {
      console.error(error);
    };

  };

  useEffect(() => {
    fetchMovies(limit);
  }, [limit]);

  const handleLoadMore = () => {
    dispatch(updateMoviesState({ isDataFetched: false }));
    setLimit((prevLimit) => prevLimit + 20);
  };

  return (

      <main className="min-h-screen bg-gray-100">

        <CategoryGroupSlider />

        <div className="w-full h-full my-5 mobile:my-1 px-2 gap-2 md:gap-3 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">

          {loading && moviesData.length < 1 ? (
            <>
              {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]">
                </div>
              ))}
            </>
          ) : ( <MoviesCard movies={moviesData} /> )}

          {loading && moviesData.length > 0 && (
            <>
              {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]"></div>
              ))}
            </>
          )}

        </div>

        {!loading && !endOfData && (
          <div className="w-full h-auto flex justify-center py-4">
            <div onClick={handleLoadMore} role="button" className="w-28 h-auto py-1.5 bg-blue-600 text-center text-white text-sm rounded-sm cursor-pointer">Load more</div>
          </div>
        )}
      </main>
  )
}



