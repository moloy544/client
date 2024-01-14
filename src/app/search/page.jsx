'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { appConfig } from "@/config/config";
import NavigateBack from "../components/NavigateBack";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LoadMoreMoviesCard = dynamic(() => import('../components/LoadMoreMoviesCard'));

function SearchPage() {

    const backendServer = appConfig.backendUrl;

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const initialSearchQuery = searchParams.get('q') || "";

    // Set all state
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);


    useEffect(() => {
        if (searchQuery !== " " || searchQuery !== "") {
            getMovies(searchQuery);
            setLoading(true);
        };

    }, []);

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

            const response = await axios.post(`${backendServer}/api/v1/movies/search?q=${query}`, {
                limitPerPage: 25,
                skip: moviesData.length
            });

            const { searchData, dataIsEnd } = response.data

            if (response.status === 200) {

                if (page === 1) {

                    setMoviesData(searchData);
                } else {
                    setMoviesData(prevData => [...prevData, ...searchData])
                }

                if (dataIsEnd) {
                    setEndOfData(true);
                };
            };

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);

        };

    }, [searchQuery]);

    // Debounced handleSearch function with a delay of 500 milliseconds
    const debouncedHandleSearch = useCallback(

        debounce((query) => {

            const params = new URLSearchParams(searchParams);

            if (query !== "") {

                params.set('q', query);

                getMovies(query);

            } else {
                params.delete('q');
            }

            replace(`${pathname}?${params.toString()}`);

        }, 1200), []);

    // Event handler for input change
    const handleSearchInputChange = (event) => {

        const userSearchText = event.target.value?.replace(/ +/g, ' ');

        if (userSearchText !== " ") {

            setSearchQuery(userSearchText);

            debouncedHandleSearch(userSearchText);

            if (!loading) {
                setLoading(true);
            };
            if (moviesData.length > 0) {
                setMoviesData([]);
            };
            if (page.length < 1) {
                setPage(1)
            };

            if (endOfData) {
                setEndOfData(false);
            };
        };
    };


    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        });

        if (moviesData?.length > 0) {
            observerRef.current.observe(
                document.getElementById("bottom_observerElement")
            );
        };

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [moviesData]);

    useEffect(() => {

        if (page.length > 1) {
            getMovies(searchQuery);
            setLoading(true);
        };

    }, [page]);

    return (
        <>
            <div className="sticky top-0 left-0 z-50 w-full h-auto bg-gray-900 border-b border-b-cyan-700">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">

                        <Link href="/" className="text-xl text-yellow-500 text-ellipsis font-bold block mobile:hidden">Movies Bazaar</Link>

                        <input onChange={handleSearchInputChange} value={searchQuery} type="text" placeholder="Search movies web series and etc"
                            className="border-2 border-yellow-600 w-[45%] mobile:w-full mobile:h-10 h-11 rounded-md px-2 text-base caret-black mobile:text-sm placeholder:text-gray-800 shadow-2xl" autoFocus />

                    </div>

                </div>

            </div>

            <div className="w-full h-auto overflow-x-hidden bg-gray-800">

                {searchQuery !== '' ? (

                    <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

                        {moviesData.length > 0 && !loading ? (
                            <>
                                <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                    Results for <span className=" text-cyan-500">{searchQuery}</span>
                                </h3>
                                <div className="w-auto h-fit gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] px-2">

                                    <LoadMoreMoviesCard limit={25} isLoading={loading} moviesData={moviesData} />

                                </div>

                            </>
                        ) : (
                            <>
                                {loading && moviesData.length < 1 && (
                                    <div className="w-full min-h-[80vh] py-5 flex justify-center items-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                            >Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {!loading && moviesData.length < 1 && searchQuery !== " " ? (
                                    <h2 className="my-40 text-yellow-500 text-xl mobile:text-base text-center font-semibold">No Movies Found</h2>
                                ) : null}
                            </>
                        )}

                    </div>
                ) : (
                    <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">
                        <h2 className="my-28 text-gray-300 text-xl mobile:text-base text-center font-semibold">Search movies and series</h2>
                    </div>
                )}

            </div >
            {/* Intersection Observer target */}
            <div ref={observerRef} id="bottom_observerElement"></div>
        </>
    )
}

export default SearchPage;
