'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { appConfig } from "@/config/config";
import NavigateBack from "@/components/NavigateBack";
import { debounceDelay, loadMoreFetch } from "@/utils";
import CategoryGroupSlider from "@/components/CategoryGroupSlider";
import { useInfiniteScroll } from "@/lib/lib";
const LoadMoreMoviesCard = dynamic(() => import('@/components/LoadMoreMoviesCard'));

export default function SearchPage() {

    const backendServer = appConfig.backendUrl;

    // Set all state
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    // infinite scroll load data custom hook
    const bottomObserverElement = useInfiniteScroll({
        callback: loadMore,
        loading,
        isAllDataLoad: endOfData,
        rootMargin: '100px'
    });

    const getMovies = async (q) => {
        try {

            if (q == "" || q === " ") {
                return
            };

            setLoading(true);

            const { status, data, dataIsEnd } = await loadMoreFetch({
                apiPath: `${backendServer}/api/v1/movies/search?q=${q}`,
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
    };

    const resetState = (searchText) => {
        if (searchQuery !== searchText) {
            setSearchQuery(searchText);
            setMoviesData([]);
            setPage(1);
            getMovies(searchText);
        }
    };


    // load more effect 
    useEffect(() => {
        if (page !== 1) {
            getMovies(searchQuery);
        }
    }, [page]);


    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full h-auto bg-gray-900">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">

                        <Link href="/" className="text-xl text-rose-500 text-ellipsis font-semibold block mobile:hidden">Movies Bazaar</Link>

                        <SearchBar functions={{ resetState }} />

                    </div>
                </div>

                {moviesData.length === 0 && (
                    <CategoryGroupSlider />
                )}

            </header >

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
                                    <div ref={bottomObserverElement}></div>
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
                        <h2 className="text-gray-300 text-xl mobile:text-base text-center font-semibold">Search and watch movies and series</h2>
                    </div>
                )}

            </div>
        </>
    )
};

function SearchBar({ functions }) {

    const { resetState } = functions;

    const [searchHistory, setSearchHistory] = useState([]);

    const dropDownRef = useRef(null);

    const getLocalStorageSearchHistory = () => {
        const historyData = localStorage.getItem('searchHistory');
        const parseData = historyData ? JSON.parse(historyData) : [];
        return parseData;
    }

    // set search history in state after component mount
    useEffect(() => {
        const data = getLocalStorageSearchHistory();
        setSearchHistory(data);

    }, [])

    // dropdown visibility handler
    const handleDropdownVisibility = (type) => {
        return
        const element = dropDownRef.current;
        setTimeout(() => {
            if (element) {
                element.style.display = type;
            }
        }, 400);
    };

    const searchInputChage = (event) => {
        const userSearchText = event.target.value?.replace(/ +/g, ' ').trimStart();
        if (userSearchText !== ' ' || userSearchText !== '') {
            debouncedSearch(userSearchText);
            handleDropdownVisibility('none')
        } else {
            handleDropdownVisibility('block')
        }
    };

    const debouncedSearch = useCallback(debounceDelay((userSearchText) => {

        resetState(userSearchText);

       /** const history = getLocalStorageSearchHistory();

        const findIndex = history?.findIndex((data) => data.toLowerCase() === userSearchText.toLowerCase());

        // check if not found so add its at beggining of array
        if (findIndex === -1) {

            // check if history > 10 so remove one data from last of array
            if (parseData.length >= 10) {
                parseData.pop();
            };
            parseData.unshift(userSearchText);

            // update the localstorage data
            localStorage.setItem('searchHistory', JSON.stringify(parseData));
            setSearchHistory(parseData);
        }; **/


    }, 1200), []);

    const deleteHistoryItem = (index) => {
        const data = getLocalStorageSearchHistory();
        const updatedData = data.filter((_, i) => i !== index)
        setSearchHistory(updatedData);
        localStorage.setItem('searchHistory', JSON.stringify(updatedData));
    };

    const handleSelectHistoryItem = (q) => {
        debouncedSearch(q)
        handleDropdownVisibility('none');
        const input = document.querySelector('input[type="search"]');
        input.value = q;
    };

    return (

        <div className="w-[45%] mobile:w-full h-auto relative">

            <input
                onFocus={() => handleDropdownVisibility('block')}
                onBlur={() => handleDropdownVisibility('none')}
                onChange={searchInputChage}
                type="search"
                placeholder="Search by title, cast, genre and more..."
                className="w-full mobile:h-10 h-11 bg-gray-50 border-2 border-yellow-600 rounded-md px-4 mr-4 mobile:mr-1 text-base caret-black mobile:text-sm placeholder:text-gray-800 shadow-2xl"
            />

            {searchHistory.length > 0 && (
                <div className="hidden" ref={dropDownRef}>
                    <div className="w-full h-auto max-h-56 overflow-y-scroll bg-white absolute top-12 z-50 rounded-b-sm">
                        <div className="flex justify-between items-center sticky top-0 z-10 bg-white px-3 py-2">
                        <div className="text-gray-700 text-sm font-bold">Recent serches</div>
                        <div className="text-rose-600 text-xs hover:underline underline-offset-1 cursor-pointer">Clear</div>
                        </div>
                        <div className="px-2.5">
                            {searchHistory.map((data, index) => (
                                <div key={index} className="group flex justify-between items-center h-9">
                                    <div onClick={() => handleSelectHistoryItem(data)} className="w-full mobile:text-xs text-sm text-gray-500 font-medium cursor-pointer flex gap-3">
                                        <i className="bi bi-clock-history"></i>
                                        <span>
                                            {data}
                                        </span>
                                    </div>
                                    <button onClick={() => deleteHistoryItem(index)} type="button" className="text-base text-gray-900 hidden group-hover:block px-2">
                                        <span className="sr-only"></span>
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}
