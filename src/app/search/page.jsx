'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { appConfig } from "@/config/config";
import NavigateBack from "../components/NavigateBack";
import { loadMoreFetch } from "@/utils";
import CategoryGroupSlider from "../components/CategoryGroupSlider";

const LoadMoreMoviesCard = dynamic(() => import('../components/LoadMoreMoviesCard'));

function SearchPage() {

    const backendServer = appConfig.backendUrl;

    // Set all state
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const bottomObserverElement = useRef(null);

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const getMovies = useCallback(async (query) => {

        try {

            const { status, data, dataIsEnd } = await loadMoreFetch({
                apiPath: `${backendServer}/api/v1/movies/search?q=${query}`,
                limitPerPage: 25,
                skip: moviesData?.length || 0,
            });

            if (status === 200) {

                setMoviesData(prevData => [...prevData, ...data.moviesData]);
            };

            if (dataIsEnd) {
                setEndOfData(true);
            };

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        };

    }, [moviesData.length]);

    // Debounced handleSearch function with a delay of 500 milliseconds
    const debouncedHandleSearch = useCallback(

        debounce((query) => {

            if (query !== "") {

                getMovies(query);

                if (moviesData.length > 0) {
                    setMoviesData([]);
                };
                if (page !== 1) {
                    setPage(1)
                };

                if (endOfData) {
                    setEndOfData(false);
                };
            };

        }, 1200), [page, moviesData.length, endOfData]);

    // Event handler for input change
    const handleSearchInputChange = (event) => {

        const userSearchText = event.target.value?.replace(/ +/g, ' ');

        if (userSearchText !== " ") {

            setSearchQuery(userSearchText);

            debouncedHandleSearch(userSearchText);

            if (!loading) {
                setLoading(true);
            };
        };

        if (userSearchText === "") {
            setMoviesData([])
        };
    };

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "300px",
            threshold: 1.0,
        });

        if (bottomObserverElement.current && moviesData.length > 0 && !loading && !endOfData) {
            observer.observe(bottomObserverElement.current);
        };

        return () => {
            if (bottomObserverElement.current) {
                observer.unobserve(bottomObserverElement.current);
            }
        };
    }, [moviesData.length, loading, endOfData]);

    useEffect(() => {

        if (page !== 1) {
            getMovies(searchQuery);
            setLoading(true);
        };

    }, [page]);

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full h-auto bg-gray-900">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">

                        <Link href="/" className="text-xl text-rose-500 text-ellipsis font-semibold block mobile:hidden">Movies Bazaar</Link>

                        <input
                            onChange={handleSearchInputChange}
                            value={searchQuery} 
                            type="search"
                            placeholder="Search movies web series and more..."
                            className="w-[45%] mobile:w-full mobile:h-10 h-11 bg-gray-50 border-2 border-yellow-600 rounded-md px-4 mr-4 mobile:mr-1 text-base caret-black mobile:text-sm placeholder:text-gray-800 shadow-2xl" autoFocus />

                    </div>

                </div>

                {moviesData.length === 0 && (
                    <CategoryGroupSlider />
                )}

            </header>

            <div className="w-full h-auto overflow-x-hidden">

                {searchQuery !== "" ? (

                    <div className="w-full h-full py-3 mobile:py-2">

                        {moviesData.length > 0 ? (
                            <>
                                <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                    Results for <span className=" text-cyan-500">{searchQuery}</span>
                                </h3>
                                <main className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2">

                                    <LoadMoreMoviesCard limit={25} isLoading={loading} moviesData={moviesData} />

                                </main>
                            </>
                        ) : (
                            <>
                                {loading && moviesData.length < 1 && (
                                    <div className="w-full py-5 flex justify-center items-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                            >Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {!loading && moviesData.length < 1 && searchQuery !== " " && (
                                    <h2 className="my-40 text-gray-300 text-xl mobile:text-base text-center font-semibold">We are not found anything</h2>
                                )}
                            </>
                        )}

                    </div>
                ) : (
                    <div className="w-full h-full my-40">
                        <h2 className="text-gray-300 text-xl mobile:text-base text-center font-semibold">Search movies and series</h2>
                    </div>
                )}

            </div >

            <div className=" w-full h-2" ref={bottomObserverElement}></div>
        </>
    )
}

export default SearchPage;
