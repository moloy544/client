'use client'
import CategoryGroupSlider from "@/app/components/CategoryGroupSlider";
import MoviesCard from "@/app/components/MoviesCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function page({ params }) {

    const category = params.cname;

    const editCategory = category.toLowerCase().replace(/[-]/g, ' ');

    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const [endOfData, setEndOfData] = useState(false);
    const [moviesData, setMoviesData] = useState([]);

    const fetchMoviesData = async () => {

        const options = {
            method: 'GET',
            url: 'https://global-movies-api-hub.p.rapidapi.com/movies',
            params: {
                limit: limit,
                offset: '0',
                orderBy: 'createdAt_DESC',
                'filter[ratingRange][0]': '0',
                'filter[ratingRange][1]': '10',
                'filter[yearRange][0]': editCategory === 'new release' ? '2023' : '1985',
                'filter[yearRange][1]': '2023'
            },
            headers: {
                'X-RapidAPI-Key': '6efb3ec6ffmsh61c0e11f801b31fp104145jsn392cbc630ebd',
                'X-RapidAPI-Host': 'global-movies-api-hub.p.rapidapi.com'
            }
        };

        try {

            setLoading(true);

            const response = await axios.request(options);

            setLoading(false);

            if (response.status === 200) {

                const responseData = response.data;

                if (responseData.rows.length !== totalResults) {

                    setTotalResults(responseData.rows.length);

                    setMoviesData(responseData.rows);

                } else {
                    setEndOfData(false);
                };

            } else {
                console.log("Server is not responding")
            };

        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {

        fetchMoviesData(limit);

    }, [limit]);

    const handleLoadMore = () => {
        setLimit((prevLimit)=> prevLimit + 10);
    };

    return (

        <main className="min-h-screen bg-gray-100">

            <CategoryGroupSlider />

            <div className="w-full h-full my-5 px-2 gap-2 md:gap-3 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">

                {loading && moviesData.length < 1 ? (
                    <>
                        {Array.from({ length: 20 }, (_, index) => (
                            <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]">
                            </div>
                        ))}
                    </>
                ) : (<MoviesCard movies={moviesData} />)}

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