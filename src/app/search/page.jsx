'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/config/config";
import { loadMoreFetch } from "@/utils";
import { useInfiniteScroll } from "@/hooks/observers";
import { ModelsController } from "@/lib/EventsHandler";
import NavigateBack from "@/components/NavigateBack";
import CategoryGroupSlider from "@/components/CategoryGroupSlider";
import { ResponsiveMovieCard } from "@/components/cards/Cards";
import SomthingWrongError from "@/components/errors/SomthingWrongError";
import Footer from "@/components/Footer";
import AdsterraAds from "@/components/ads/AdsterraAds";
import { adsConfig } from "@/config/ads.config";

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
    const [error, setError] = useState(false);
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

        // Reset the search result and end of data flag and back to top window for best user experience
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        })
        setSearchQuery(searchText);
        setPage(1);
        setSearchResult([]);
        setEndOfData(false);
        getMovies(searchText);
    };

    // Function to add a search term to the search history
    const addToSearchHistory = (newData) => {

        const { text } = newData || {};

        const existingHistoryArray = getLocalStorageSearchHistory();

        // Check if the search term already exists in the search history
        const searchTermIndex = existingHistoryArray.findIndex(search => search.searchKeyword?.toLowerCase() === text?.toLowerCase());

        // If the search term exists, update clickCount and move it to the beginning
        if (searchTermIndex !== -1) {

            const existingTerm = existingHistoryArray.splice(searchTermIndex, 1)[0];
            //update the search count
            existingTerm.count += 1;

            existingHistoryArray.unshift(existingTerm);

        } else {

            // If the search term doesn't exist, add it to the beginning with clickCount 1
            existingHistoryArray.unshift({ searchKeyword: text, count: 1 });
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

            if (q === " " || q === "" || loading) {
                return
            };

            if (error) {
                setError(false);
            };

            setLoading(true);
            const { status, data, dataIsEnd } = await loadMoreFetch({
                apiPath: `${backendServer}/api/v1/movies/search?q=${q}`,
                limitPerPage,
                skip: page === 1 ? 0 : page * limitPerPage,
                bodyData: {
                    dateSort: -1,
                }
            });

            if (status !== 200) {
                setError(true);
                setLoading(false);
                return
            }

            const { moviesData } = data || {};

            if (status === 200 && moviesData && moviesData.length > 0) {

                // set search result
                setSearchResult(prevData => [...prevData, ...moviesData]);
            };

            if (dataIsEnd) {
                setEndOfData(true);
            };

        } catch (error) {
            console.log(error);
            setError(true);
        } finally {
            setLoading(false);
        };
    }, [page, loading]);

    useEffect(() => {
        if (page !== 1) {
            getMovies(searchQuery);
        }

    }, [page, searchQuery]);

    const onMovieCardClickHandler = (e) => {
        const tragetElement = e.target;
        if (tragetElement) {
            const altData = tragetElement.alt || null;
            if (altData) {
                addToSearchHistory({ text: searchQuery });
            }
        }

    }

    // check is error encountered show error message
    if (error) {
        return <SomthingWrongError onclickEvent={() => window.location.reload()} />
    };

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full h-auto bg-gray-900">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-2 px-2.5 mobile:py-1.5 mobile:px-2">

                        <div className="flex items-center space-x-0.5 mobile:hidden">
                            <Image
                                src="https://res.cloudinary.com/dxhafwrgs/image/upload/v1720111766/moviesbazaar/brand_logo.png"
                                width={35}
                                height={35}
                                alt="Mobies bazar logo"
                                className="w-11 h-11 mobile:w-9 mobile:h-9"
                            />
                            <div className="flex flex-col mt-1">
                                <Link href="/" className="font-semibold text-yellow-600 text-xl mobile:text-[15px] leading-[14px]">
                                    Movies Bazar
                                </Link>
                                <small className="text-yellow-600 mt-1 mobile:mt-0.5 text-xs mobile:text-[10px] font-medium pl-0.5">Made with love</small>
                            </div>
                        </div>

                        <SearchBar
                            searchHistory={searchHistory}
                            setSearchHistory={setSearchHistory}
                            functions={{ handleSubmitForm }}
                        />

                    </div>
                </div>

                <CategoryGroupSlider />

            </header >

            <div className="w-full min-h-screen overflow-x-hidden bg-gray-800">

                {/*** Banner Ad Show Container Size height 250, width 300  ****/ seatrchResult.length === 0 &&
                    (<div className="my-2">
                        <AdsterraAds adOptions={adsConfig.adOptions1} />
                    </div>)
                }

                {searchQuery !== "" ? (

                    <div className="w-full h-full">

                        {seatrchResult.length > 0 && (
                            <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                Results for <span className=" text-cyan-500">{searchQuery}</span>
                            </h3>
                        )}
                        <main className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2">
                            {seatrchResult.map((movie, index) => (
                                <ResponsiveMovieCard
                                    key={movie.imdbId || index}
                                    data={movie}
                                    onClickEvent={onMovieCardClickHandler}
                                />
                            ))}

                        </main>

                        {loading && (
                            <div className="w-full h-full flex justify-center items-center my-14 mobile:my-12">
                                <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>
                                </div>
                            </div>
                        )}

                        {!loading && seatrchResult.length < 1 && searchQuery !== " " && (
                            <div className="flex flex-col justify-center my-40 space-y-2 px-4">
                                <h2 className="text-gray-300 text-xl mobile:text-base text-center font-semibold">
                                    We are not found anything
                                </h2>
                                <small className="text-xs text-gray-300 text-center font-medium">Please double check the search keyword spelling and try again for 100% best result try with same title</small>
                            </div>
                        )}

                        <div ref={bottomObserverElement}></div>

                    </div>
                ) : (
                    <div className="w-full h-full my-40">
                        <h2 className="text-gray-200 text-xl mobile:text-base text-center font-semibold">Search and watch movies and series</h2>
                    </div>
                )}

            </div>

            <Footer />
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
                                <small className="text-xs text-gray-500 font-normal w-[80%]">This is your recent success search history results</small>
                            </div>

                            <div className="py-3 px-1.5 w-auto max-h-60 overflow-y-scroll scrollbar-hidden">
                                {searchHistory.map((data, index) => (
                                    <div key={index} className="group flex justify-between items-center h-auto hover:bg-slate-200 hover:bg-opacity-50 p-2 rounded-md">
                                        <div onClick={() => handleSelectHistoryItem(data.searchKeyword)} className="w-full mobile:text-xs text-sm text-gray-600 font-medium cursor-pointer flex items-center gap-3">
                                            <i className="bi bi-clock-history"></i>
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
