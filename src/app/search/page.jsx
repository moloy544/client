'use client'
import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "../components/NavigateBack";

const LoadMoreMoviesGirdWarper = dynamic(() => import("../components/LoadMoreMoviesGirdWarper"));

function SearchPage() {

    const backendServer = appConfig.backendUrl;

    // Set all state
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

    const getMovies = async (query) => {

        try {

            if (endOfData) {
                setEndOfData(false);
            };

            const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
                apiPath: `${backendServer}/api/v1/movies/search?q=${query}`,
                limitPerPage: 30,
                page: 1
            });

            setMoviesData(filterResponse);

            if (dataIsEnd) {
                setEndOfData(true);
            };

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            
        }
    };

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

            getMovies(value);

        }, 1200), []);

    // Event handler for input change
    const handleSearchInputChange = (event) => {

        const userSearchText = event.target.value.replace(/ +/g, ' ');
        
        if (userSearchText !== " ") {
           
            setSearchQuery(userSearchText);

            if (!loading) {
                setLoading(true);
            };

            if (moviesData.length > 0) {
                setMoviesData([]);
            }

            debouncedHandleSearch(userSearchText);
        }
    };

    return (
        <>
            <div className="sticky top-0 left-0 z-50 w-full h-auto bg-red-800">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">
                        <Link href="/" className="text-xl text-yellow-300 text-ellipsis font-bold block mobile:hidden">Movies Bazaar</Link>
                        <input onChange={handleSearchInputChange} value={searchQuery} type="text" placeholder="Search movies web series and etc" className="border-2 border-red-800 w-[42%] mobile:w-full mobile:h-10 h-11 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500 shadow-2xl" autoFocus />
                    </div>

                </div>

            </div>

            <div className="w-full h-auto overflow-x-hidden bg-gray-800">

                {searchQuery?.trim() !== '' ? (

                    <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

                        {moviesData.length > 0 && !loading ? (
                            <>
                                <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                    Results for <span className=" text-cyan-500">{searchQuery}</span>
                                </h3>
                                <LoadMoreMoviesGirdWarper
                                    apiUrl={`${backendServer}/api/v1/movies/search?q=${searchQuery}`}
                                    initialPage={1}
                                    initialMovies={moviesData}
                                    isDataEnd={endOfData} />
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
                                {!loading && moviesData.length < 1 && (
                                    <h2 className="my-20 text-yellow-500 text-xl mobile:text-base text-center font-semibold">No Movies Found</h2>
                                )}
                            </>
                        )}

                    </div>
                ) : (
                    <div className="w-full h-full min-h-[80vh] py-3 mobile:py-2">
                        <h2 className="my-28 text-gray-300 text-xl mobile:text-base text-center font-semibold">Search Movies and Series</h2>
                    </div>
                )}

                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>
            </div >
        </>
    )
}

export default SearchPage;
