'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { appConfig } from "@/config/config";
import { adsConfig } from "@/config/ads.config";
import { creatToastAlert, loadMoreFetch } from "@/utils";
import { useInfiniteScroll } from "@/hooks/observers";
import { ModelsController } from "@/lib/EventsHandler";
import NavigateBack from "@/components/NavigateBack";
import CategoryGroupSlider from "@/components/CategoryGroupSlider";
import { ResponsiveMovieCard } from "@/components/cards/Cards";
import SomthingWrongError from "@/components/errors/SomthingWrongError";
import Footer from "@/components/Footer";
import brandLogoIcon from "../../assets/images/brand_logo.png"

//import AdsterraBannerAds from "@/components/ads/AdsterraBannerAds";

// this is return user search history data
const getLocalStorageSearchHistory = () => {
    const historyData = localStorage.getItem('searchHistory');
    const parseData = historyData ? JSON.parse(historyData) : [];
    return parseData;
}

export default function SearchPage() {

    const backendServer = appConfig.backendUrl;

    const limitPerPage = 30;

    const router = useRouter();

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
        setEndOfData(false);
        setSearchResult([]);
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

            if (q === " " || q === "") {
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

            if (status === 200 && moviesData) {

                if (page === 1) {
                    // Add single array search results 
                    setSearchResult(moviesData);

                } else {
                    // Add new array search results to existing array 
                    setSearchResult(prevData => [...prevData, ...moviesData]);
                }
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

        const params = new URLSearchParams(window.location.search);
        const paramsQuery = params.get("query");

        // Handle the initial search when query parameter is present
        if (paramsQuery && paramsQuery !== searchQuery) {
            handleSubmitForm(paramsQuery);  // This updates searchQuery
            const inputSearchBar = document.querySelector("#search-bar-input");
            if (inputSearchBar) {
                inputSearchBar.value = paramsQuery;
            }
        }

    }, []);

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
            <header className="fixed top-0 left-0 z-50 w-full h-auto bg-gray-900">

                <div className="w-auto h-auto flex gap-1 items-center">

                    <NavigateBack className="bi bi-arrow-left text-gray-100 ml-4 mobile:ml-2 text-3xl mobile:text-[25px] cursor-pointer w-fit" />

                    <div className="w-full mobile:bg-transparent h-auto flex justify-between items-center py-2 px-2.5 mobile:py-1.5 mobile:px-2">

                        <div className="flex items-center space-x-0.5 mobile:hidden">
                            <Image
                                src={brandLogoIcon}
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

            <div className="w-full h-full bg-custom-dark-bg overflow-x-hidden mobile:pt-28 pt-32">

                {/*** Banner Ad Show Container Size height 250, width 300 seatrchResult.length === 0 &&
                    (<div className="my-2">
                        <AdsterraBannerAds adOptions={adsConfig.adOptions1} />
                    </div>
                    )}****/}

                {searchQuery !== "" ? (

                    <div className="w-full h-full">

                        {seatrchResult.length > 0 && (
                            <h3 className="text-gray-300 text-base mobile:text-sm py-2 font-bold px-2">
                                Results for <span className=" text-cyan-500">{searchQuery}</span>
                            </h3>
                        )}
                        <main className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] px-2 pt-3 pb-10 mobile:pt-2">
                            {seatrchResult.map((movie, index) => (
                                <ResponsiveMovieCard
                                    key={movie.imdbId || index}
                                    data={movie}
                                    onClickEvent={onMovieCardClickHandler}
                                />
                            ))}

                        </main>

                        {loading && (
                            <div className={`w-full h-full flex justify-center items-center ${seatrchResult.length > 0 ? "my-14 mobile:my-12" : "my-36 mobile:my-32"}`}>
                                <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                    >Loading...</span>
                                </div>
                            </div>
                        )}

                        {!loading && seatrchResult.length < 1 && searchQuery !== " " && (
                            <div className="flex flex-col justify-center my-40 space-y-2 px-4">
                                <h2 className="text-gray-100 text-xl mobile:text-base text-center font-semibold">
                                    We are not found anything
                                </h2>
                                <small className="text-xs text-gray-200 text-center font-medium">Please double check the search keyword spelling and try again for 100% best result try with same title</small>
                                <button className="w-fit mx-auto h-auto py-2 px-4 text-gray-100 font-medium text-sm bg-gray-900 hover:bg-gray-950 rounded-md" onClick={() => router.push('/request-form')}>
                                    <i className="bi bi-send"></i> Request content
                                </button>
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

    const pathname = usePathname();

    const [visibility, setVisibility] = useState(false);
    const [filteredHistory, setFilteredHistory] = useState(searchHistory);
    const [isAdClick, setIsAdClick] = useState(false);
    const [tryCount, setTryCount] = useState(0);

    const hideModel = () => {
        setVisibility(false);
    };

    // Set search history in state after component mount
    useEffect(() => {
        const data = getLocalStorageSearchHistory();
        setSearchHistory(data);
        setFilteredHistory(data);
    }, []);

    const searchInputChange = (event) => {
        const userSearchText = event.target.value?.replace(/ +/g, ' ').trimStart();

        // Show the model if the input has any value
        if (userSearchText !== '' && userSearchText !== ' ') {
            setVisibility(true);
            // Filter search history based on user input
            const filtered = searchHistory.filter(item =>
                item.searchKeyword.toLowerCase().includes(userSearchText.toLowerCase())
            );
            setFilteredHistory(filtered);
        } else {
            // If input is empty, reset filtered history to original search history
            setVisibility(false);
            setFilteredHistory(searchHistory);
        };
        if (tryCount !== 0) {
            setTryCount(0);
        }
    };

    const handleInputClick = () => {
        setVisibility(true);
        if (!isAdClick && process.env.NODE_ENV === "production") {
            window.open(adsConfig.direct_Link, '_blank', 'noopener,noreferrer'); // Open the ad link
            setIsAdClick(true);
        }
    };

    function handleSearch(term) {
        const params = new URLSearchParams(window.location.search);

        // If the term is provided, set the 'query' param, otherwise remove it
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        // Use history.pushState() to update the URL without reloading the page
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }


    const submit = (event) => {
        event.preventDefault();
        // Get form data or search text value from form data
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const searchValue = formJson.searchText?.trim();

        if (tryCount >= 3) {
            creatToastAlert({
                message: 'You have reached the maximum number of attempts',
            });
            return;
        };

        if (searchValue !== '' && searchValue !== " ") {
            handleSubmitForm(searchValue);
            handleSearch(searchValue)
            setTryCount((prevCount) => prevCount + 1);
        }
    };

    const deleteHistoryItem = (index) => {
        if (index === "Clear all") {
            setSearchHistory([]);
            setFilteredHistory([]);
            localStorage.removeItem('searchHistory');
            return;
        }
        const data = getLocalStorageSearchHistory();
        const updatedData = data.filter((_, i) => i !== index);
        setSearchHistory(updatedData);
        setFilteredHistory(updatedData);
        localStorage.setItem('searchHistory', JSON.stringify(updatedData));
    };

    const handleSelectHistoryItem = (q) => {
        const input = document.querySelector('input[type="text"]');
        input.value = q;
        if (q !== '' && q !== " ") {
            handleSubmitForm(q);
            setVisibility(false);
            handleSearch(q)
        }
    };

    return (
        <div className="w-[45%] mobile:w-full h-auto relative">
            <form onSubmit={submit} className="flex items-center w-auto h-auto relative">
                <NavigateBack>
                    <button
                        type="button"
                        className="absolute left-0 flex items-center justify-center w-10 h-12 mobile:h-10 bg-gray-900 bg-opacity-75 border-2 border-r-0 border-gray-800 rounded-md rounded-r-none text-gray-300 hover:bg-opacity-80 transition-colors duration-200"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </NavigateBack>
                <input
                    className="w-full h-12 mobile:h-10 bg-transparent border-2 border-gray-800 rounded-l-md px-3 text-base font-medium mobile:text-sm mobile:placeholder:text-xs text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-600 caret-teal-600 shadow-md transition-colors duration-200 pl-10" // Added padding-left for the icon
                    onClick={handleInputClick}
                    onChange={searchInputChange}
                    type="text"
                    name="searchText"
                    id="search-bar-input"
                    placeholder="Search by title, cast, year and more..."
                    autoComplete="off"
                    required
                />
                <button
                    type="submit"
                    className="w-24 h-12 mobile:h-10 bg-teal-700 border-2 border-teal-800 text-gray-100 font-medium text-sm hover:bg-teal-600 rounded-md rounded-l-none transition-colors duration-200"
                >
                    Search
                </button>
            </form>


            <ModelsController visibility={visibility} closeEvent={hideModel}>
                <div className="w-full h-auto bg-white absolute top-12 z-50 rounded-b-md shadow-lg">
                    {filteredHistory.length > 0 ? (
                        <>
                            <div className="flex flex-col sticky top-0 z-10 bg-white px-3 py-2">
                                <div className="w-full flex items-center justify-between">
                                    <div className="text-gray-700 text-sm font-bold">Recent Searches</div>
                                    <button
                                        type="button"
                                        title="Clear all"
                                        onClick={() => deleteHistoryItem('Clear all')}
                                        className="text-rose-600 text-xs hover:underline underline-offset-1 px-1.5 py-1">
                                        Clear
                                    </button>
                                </div>
                                <small className="text-xs text-gray-500 font-medium w-[80%]">
                                    Showing recent search keywords based on your search results with clcik.
                                </small>
                            </div>

                            <div className="py-3 px-1.5 w-auto max-h-60 overflow-y-scroll scrollbar-hidden">
                                {filteredHistory.map((data, index) => (
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
                    ) : (
                        <div className="w-full h-auto flex items-center justify-center py-3 px-2">
                            <h2 className="text-gray-600 text-base mobile:text-base text-center font-medium">No recent search keywords found</h2>
                        </div>
                    )}
                </div>
            </ModelsController>
        </div>
    )
}
