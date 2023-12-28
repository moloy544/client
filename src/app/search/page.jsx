'use client'
import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "../components/NavigateBack";

const LoadMoreMoviesGirdWarper = dynamic(() => import("../components/LoadMoreMoviesGirdWarper"));

function SearchPage() {

    const backendServer = appConfig.backendUrl;

    // Set all state
    const [searchQuery, setSearchQuery] = useState('');
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

    const getMovies = async (query) => {

        setEndOfData(false);

        const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
            apiPath: `${backendServer}/api/v1/movies/search?q=${query}`,
            limitPerPage: 30,
            page: 1
        });

        setMoviesData(filterResponse);

        if (dataIsEnd) {
            setEndOfData(true);
        };
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
            setMoviesData([]);
        }, 1200), []);

    // Event handler for input change
    const handleSearchInputChange = (event) => {

        const trimValue = event.target.value.replace(/ +/g, ' ');

        debouncedHandleSearch(trimValue);

    // Update the controlled input value in state
    if (event.target.value !== " ") {
     
        setSearchQuery(trimValue);
    };

    };

    return (
        <>
            <div className="sticky top-0 left-0 z-50 w-full h-auto bg-red-800">

                <div className="w-auto h-auto flex gap-2 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">
                        <Link href="/" className="text-xl text-yellow-300 text-ellipsis font-bold block mobile:hidden">Movies Bazaar</Link>
                        <input onChange={handleSearchInputChange} value={searchQuery} type="text" placeholder="Search movies web series and etc" className="border-2 border-red-800 w-[45%] mobile:w-full mobile:h-10 h-11 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500 shadow-2xl" autoFocus />
                    </div>

                </div>

                <div className="w-auto h-auto mobile:hidden">

                    <CategoryGroupSlider />

                </div>

            </div>

            <div className="w-full h-auto overflow-x-hidden">

                {searchQuery !== "" ? (

                    <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2">

                        <LoadMoreMoviesGirdWarper
                            apiUrl={`${backendServer}/api/v1/movies/search?q=${searchQuery}`}
                            initialPage={1}
                            initialMovies={moviesData}
                            isDataEnd={endOfData} />
                    </div>
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
