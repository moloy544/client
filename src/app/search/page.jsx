'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/config/config";
import { loadMoreFetch } from "@/utils";
import { useInfiniteScroll } from "@/lib/lib";
import { ModelsController } from "@/lib/EventsHandler";
import NavigateBack from "@/components/NavigateBack";
import CategoryGroupSlider from "@/components/CategoryGroupSlider";
import { MovieCardSkleaton, ResponsiveMovieCard } from "@/components/cards/Cards";

// this is return user search history data
const getLocalStorageSearchHistory = () => {
    const historyData = localStorage.getItem('searchHistory');
    const parseData = historyData ? JSON.parse(historyData) : [];
    return parseData;
}

export default function SearchPage() {

    const backendServer = appConfig.backendUrl;

    const limitPerPage = 30;

    // Set all state
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [seatrchResult, setSearchResult] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // infinite scroll load data custom hook
    const bottomObserverElement = useInfiniteScroll({
        callback: loadMore,
        loading,
        isAllDataLoad: seatrchResult.length > 0 ? endOfData : true,
        rootMargin: '100px'
    });

    // after form submission this function is called
    const handleSubmitForm = (searchText) => {
        setSearchQuery(searchText);
        setPage(1);
        setSearchResult([]);
        setEndOfData(false);
        getMovies(searchText);
    };

    // Function to add a search term to the search history
    const addToSearchHistory = (newData) => {

        const existingHistoryArray = getLocalStorageSearchHistory();

        // Check if the search term already exists in the search history
        const searchTermIndex = existingHistoryArray.findIndex(search => search.searchKeyword?.toLowerCase() === newData.text?.toLowerCase());

        // If the search term exists, update clickCount and move it to the beginning
        if (searchTermIndex !== -1) {

            const existingTerm = existingHistoryArray.splice(searchTermIndex, 1)[0];
            existingTerm.count += 1;
            existingHistoryArray.unshift(existingTerm);

        } else {

            // If the search term doesn't exist, add it to the beginning with clickCount 1
            existingHistoryArray.unshift({ searchKeyword: newData.text, image: newData.image, count: 1 });
        };

        // Limit the search history to 20 items
        if (existingHistoryArray.length > 20) {

            existingHistoryArray.splice(20);
        };

        // Save the updated search history array back to local storage
        localStorage.setItem('searchHistory', JSON.stringify(existingHistoryArray));
        setSearchHistory(existingHistoryArray);
    };
    // get serach items from database function
    const getMovies = useCallback(async (q) => {
        try {

            if (q === " " || q === "") {
                return
            };

            setLoading(true);

            const { status, data, dataIsEnd } = await loadMoreFetch({
                apiPath: `${backendServer}/api/v1/movies/search?q=${q}`,
                limitPerPage,
                skip: page === 1 ? 0 : page * limitPerPage
            });

            const { moviesData } = data || {};

            if (status === 200 && moviesData && moviesData.length > 0) {

                // set search result
                setSearchResult(prevData => [...prevData, ...moviesData]);

                // setup search history
                const thambnail = moviesData[0].thambnail;
                if (thambnail && thambnail !== '') {
                    addToSearchHistory({ text: q, image: thambnail });
                };
            };

            if (dataIsEnd) {
                setEndOfData(true);
            };

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        };
    }, [page]);
    useEffect(() => {
        if (page !== 1) {
            getMovies(searchQuery)
        }
    }, [page]);

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full h-auto bg-gray-900">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2">

                        <Link href="/" className="text-xl text-rose-500 text-ellipsis font-semibold block mobile:hidden">Movies Bazaar</Link>

                        <SearchBar
                            searchHistory={searchHistory}
                            setSearchHistory={setSearchHistory}
                            functions={{ handleSubmitForm }}
                        />

                    </div>
                </div>

                {seatrchResult.length === 0 && (
                    <CategoryGroupSlider />
                )}

            </header >

            <div className="w-full h-auto overflow-x-hidden">

                {searchQuery !== "" ? (

                    <div className="w-full h-full py-3 mobile:py-2">

                        {seatrchResult.length > 0 ? (
                            <>
                                <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                    Results for <span className=" text-cyan-500">{searchQuery}</span>
                                </h3>
                                <main className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2">

                                    {seatrchResult.length > 0 && (
                                        seatrchResult.map((movie, index) => (
                                            <ResponsiveMovieCard key={movie.imdbId || index} data={movie} />
                                        )))}

                                    {loading && (
                                        <MovieCardSkleaton limit={limitPerPage}
                                        />)}

                                </main>
                                <div ref={bottomObserverElement}></div>
                            </>
                        ) : (
                            <>
                                {loading && seatrchResult.length < 1 && (
                                    <div className="w-full py-5 flex justify-center items-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                            role="status">
                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                            >Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {!loading && seatrchResult.length < 1 && searchQuery !== " " && (
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

function SearchBar({ functions, searchHistory, setSearchHistory }) {

    const { handleSubmitForm } = functions;

    const [visibility, setVisibility] = useState(false);

    const hideModel = () => {
        setVisibility(false);
    }

    // set search history in state after component mount
    useEffect(() => {
        const data = getLocalStorageSearchHistory();
        setSearchHistory(data);
    }, [])


    const searchInputChage = (event) => {
        const userSearchText = event.target.value?.replace(/ +/g, ' ').trimStart();
        if (userSearchText !== ' ' && userSearchText !== '') {
            setVisibility(false)
        } else {
            setVisibility(true)
        }
    };

    const submit = (event) => {

        event.preventDefault();
        // get form data or search text value from form data
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const searchValue = formJson.searchText?.trim();

        if (searchValue !== '' && searchValue !== " ") {
            handleSubmitForm(searchValue);
        };
    };

    const deleteHistoryItem = (index) => {
        if (index === "Clear all") {
            setSearchHistory([]);
            localStorage.removeItem('searchHistory');
            return;
        };
        const data = getLocalStorageSearchHistory();
        const updatedData = data.filter((_, i) => i !== index);
        setSearchHistory(updatedData);
        localStorage.setItem('searchHistory', JSON.stringify(updatedData));
    };

    const handleSelectHistoryItem = (q) => {
        const input = document.querySelector('input[type="text"]');
        input.value = q;
        if (q !== '' && q !== " ") {
            handleSubmitForm(q);
            setVisibility(false);
        };
    };

    return (

        <div className="w-[45%] mobile:w-full h-auto relative">
            <form onSubmit={submit} className="w-auto h-auto flex items-center">
                <input
                    className="w-full mobile:h-10 h-11 bg-gray-50 border-2 border-yellow-600 border-r-transparent rounded-r-none rounded-md px-2 text-base caret-black mobile:text-sm placeholder:text-gray-800 mobile:placeholder:text-xs placeholder:text-sm shadow-2xl"
                    onClick={() => setVisibility(true)}
                    onChange={searchInputChage}
                    type="text"
                    name="searchText"
                    placeholder="Search by title, cast, genre and more..."
                    required
                />
                <button type="submit" className="w-20 mobile:h-10 h-11 bg-yellow-500 border-2 border-yellow-600 border-l-transparent rounded-l-none text-gray-800 font-serif text-center text-sm px-2 rounded-md">Search</button>
            </form>

            <ModelsController visibility={visibility} closeEvent={hideModel}>

                <div className="w-full h-auto bg-white absolute top-12 z-50 rounded-b-md shadow-lg">
                    {searchHistory.length > 0 ? (
                        <>
                            <div className="flex flex-col sticky top-0 z-10 bg-white px-3 py-2">
                                <div className="w-full flex items-center justify-between">
                                    <div className="text-gray-700 text-sm font-bold">Recent serches</div>
                                    <button
                                        type="button"
                                        title="Clear all"
                                        onClick={() => deleteHistoryItem('Clear all')} className="text-rose-600 text-xs hover:underline underline-offset-1 px-1.5 py-1">
                                        Clear
                                    </button>
                                </div>
                                <small className="text-xs text-gray-500 font-normal w-[80%]">Recent show history data based on past success search result</small>
                            </div>

                            <div className="py-3 px-1.5 w-auto max-h-60 overflow-y-scroll scrollbar-hidden">
                                {searchHistory.map((data, index) => (
                                    <div key={index} className="group flex justify-between items-center h-auto hover:bg-slate-200 hover:bg-opacity-50 p-2 rounded-md">
                                        <div onClick={() => handleSelectHistoryItem(data.searchKeyword)} className="w-full mobile:text-xs text-sm text-gray-600 font-medium cursor-pointer flex items-center gap-3">
                                            <i className="bi bi-clock-history"></i>
                                            <Image
                                                priority
                                                className="w-9 h-12 border border-gray-500 rounded-sm"
                                                width={28}
                                                height={28}
                                                src={data.image}
                                                alt="Search history items image" />
                                            <div className="line-clamp-2 max-w-xs">
                                                {data.searchKeyword}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteHistoryItem(index)} type="button" title="Remove" className="w-8 h-8 rounded-full hover:bg-blue-100 text-base text-center text-gray-900 hidden mobile:block group-hover:block px-2">
                                            <span className="sr-only"></span>
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (<div className="w-full h-auto flex items-center justify-center py-3 px-2">
                        <h2 className="text-gray-600 text-base mobile:text-base text-center font-medium">No recent searches</h2>
                    </div>)}
                </div>
            </ModelsController>

        </div>

    )
}
