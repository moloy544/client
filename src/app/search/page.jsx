'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import MoviesCard from "../components/MoviesCard";
import axios from "axios";
import Link from "next/link";

function SearchPage() {

    // Set all state
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

    const handleSearch = (event) => {

        setTimeout(() => {

        const trimValue = event.target.value.replace(/ +/g, ' ');

        // Update the controlled input value in state
        if (trimValue !== ' ') {
           
           setSearchQuery(trimValue);
            setPage(1);
            setEndOfData(false);
            setMoviesData([])  
            
        };

    }, 200);

    };

    //Fetch Search Items functio for call backend api
    const fetchMoviesData = useCallback(async (currentPage, query) => {

        // Create a new instance of AbortController
        const abortController = new AbortController();

        // Create a cancel token using the controller's signal
        const cancelToken = axios.CancelToken.source(abortController.signal);

        try {

            setLoading(true);

            setEndOfData(false);

            const response = await axios.post(`http://localhost:4000/api/v1/movies/get/${query}`, {
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

        if (searchQuery !== '') {

            fetchMoviesData(page, searchQuery);
        };

    }, [page, searchQuery]);

    return (
        <>

            <div className="sticky top-0 z-50 w-full h-auto border bg-white border-gray-100 shadow-md">

                <div className="w-full h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2 border">
                    <Link href="/" className="text-xl text-purple-800 text-ellipsis font-bold block mobile:hidden">Movies Bazzer</Link>
                    <input onChange={handleSearch} type="text" placeholder="Search movies web series and etc" className="border-2 border-purple-400 w-2/4 mobile:w-full h-10 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500" />
                </div>

                <CategoryGroupSlider />

            </div>

            <main className="min-h-screen bg-gray-100">

                {searchQuery !== "" && (

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
                    )}

                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>

            </main>
        </>
    )
}

export default SearchPage;
