'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import axios from 'axios';
import MoviesCard from '@/app/components/MoviesCard';
import Navbar from "@/app/components/Navbar";
import { appConfig } from "@/config/config";

export default function CategoriesMovies({ params }) {

    const editParamsQuery = params.cname.toLowerCase().replace(/[-]/g, ' ');

    const query = editParamsQuery === "new release" ? 2023 : editParamsQuery;

    // Set all state
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

    //Fetch Search Items functio for call backend api
    const fetchMoviesData = useCallback(async (currentPage) => {

        // Create a new instance of AbortController
        const abortController = new AbortController();

        // Create a cancel token using the controller's signal
        const cancelToken = axios.CancelToken.source(abortController.signal);

        try {

            setLoading(true);

            setEndOfData(false);

            const response = await axios.post(`${appConfig.backendUrl}/api/v1/movies/get/${query}`, {
                limit: 20,
                page: currentPage,
                cancelToken: cancelToken.token
            });

            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            };

            // Use a Set to filter out duplicates from the data array
            const filterMoviedData = [...new Set(response.data.moviesData)];

            //get end of data 
            const dataIsEnd = response.data.endOfData;

            if (page === 1) {

                setMoviesData(filterMoviedData);

            } else {

                setMoviesData((prevData) => [...prevData, ...filterMoviedData]);
            };

            if (dataIsEnd) {
                setEndOfData(true);
            };

            setLoading(false);

        } catch (error) {

            if (axios.isCancel(error)) {
                // Handle request cancellation
                console.log('Request canceled:', error.message);
            } else {
                // Handle other errors
                console.error('Error fetching data:', error);
            };

        } finally {
            abortController.abort();
        };

        // Return a cleanup function to abort the request when needed
        return () => abortController.abort();

    }, [page]);

    //Load More Items Window Bottom Observer function
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [setPage, loading, endOfData]);

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '10px',
            threshold: 1.0,
        });

        if (moviesData.length > 0) {
            observerRef.current.observe(document.getElementById('bottom_observerElement'));
        }

        return () => {

            if (observerRef.current) {

                observerRef.current.disconnect();
            }
        };
    }, [moviesData, handleObserver]);


    useEffect(() => {

        fetchMoviesData(page);

    }, [page]);


    return (

        <>
            <Navbar />

            <main className="min-h-screen bg-gray-100">

                <div className="w-full h-full my-5 mobile:my-1 px-2 gap-2 md:gap-3 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">

                    <MoviesCard isLoading={loading} moviesData={moviesData} />

                    {loading && moviesData.length > 0 && (
                        <>
                            {Array.from({ length: 20 }, (_, index) => (
                                <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]"></div>
                            ))}
                        </>
                    )}

                </div>

                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>

            </main>
        </>
    )
}
