'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "../components/NavigateBack";

const LoadMoreMoviesCard = dynamic(() => import('../components/LoadMoreMoviesCard'));

function SearchPage() {

    const backendServer = appConfig.backendUrl;

    // Set all state
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

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

    // Debounced handleSearch function with a delay of 500 milliseconds
    const debouncedHandleSearch = useCallback(
        debounce((value) => {
            setSearchQuery(value.trim());
            setPage(1);
            setEndOfData(false);
            setMoviesData([]);
        }, 1200),
        []
    );

    // Event handler for input change
    const handleSearchInputChange = (event) => {
        const trimValue = event.target.value.replace(/ +/g, ' ');
        debouncedHandleSearch(trimValue);
    };

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

            const getMovies = async () => {

                setLoading(true);

                setEndOfData(false);

                const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
                    apiPath: `${backendServer}/api/v1/movies/search?q=${searchQuery}`,
                    limitPerPage: 30,
                    page: page
                });

                if (page === 1) {

                    setMoviesData(filterResponse);

                } else {

                    setMoviesData((prevData) => [...prevData, ...filterResponse]);
                };

                if (dataIsEnd) {
                    setEndOfData(true);
                };

                setLoading(false);
            };

            getMovies();
        };

    }, [page, searchQuery]);

    return (
        <>
            <div className="sticky top-0 left-0 z-50 w-full h-auto bg-red-800">

                <div className="w-auto h-auto flex gap-2 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">
                        <Link href="/" className="text-xl text-yellow-300 text-ellipsis font-bold block mobile:hidden">Movies Bazaar</Link>
                        <input onChange={handleSearchInputChange} type="text" placeholder="Search movies web series and etc" className="border-2 border-red-800 w-[45%] mobile:w-full mobile:h-10 h-11 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500 shadow-2xl" autoFocus />
                    </div>

                </div>

                <div className="w-auto h-auto mobile:hidden">

                    <CategoryGroupSlider />

                </div>

            </div>

            <div className="w-full h-auto overflow-x-hidden">

                {searchQuery !== "" ? (

                    <main className="w-full min-h-[80vh] bg-gray-800 py-3 mobile:py-2 px-2 overflow-x-hidden">
                        <div className="w-auto h-fit gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
                            <LoadMoreMoviesCard isLoading={loading} moviesData={moviesData} />
                        </div>
                    </main>
                ) : (
                    <h2 className="my-14 text-gray-500 text-xl mobile:text-base text-center font-semibold">Search Movies and Series</h2>
                )}

                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>
            </div >
        </>
    )
}

export default SearchPage;
