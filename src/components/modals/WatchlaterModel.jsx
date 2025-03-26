import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { ModelsController } from "@/lib/EventsHandler";
import { appConfig } from "@/config/config";
import { creatToastAlert, creatUrlLink, resizeImage } from "@/utils";
import { useInfiniteScroll } from "@/hooks/observers";
import { safeLocalStorage } from "@/utils/errorHandlers";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('en-US', options).replace(',', '');
}

export default function WatchlaterModel({ visibility, functions }) {

    const { hideModel } = functions;

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [watchLaterData, setWatchLaterData] = useState([]);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);

    const isFirstRender = useRef(true);
    const moviesCardContauner = useRef(null);

    const loadMore = () => setPage((prevPage) => prevPage + 1);
    // infinite scroll load data custom hook
    const bottomObserverElement = useInfiniteScroll({
        callback: loadMore,
        loading,
        isAllDataLoad,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const localStorageData = safeLocalStorage.get('saved-movies-data');
                const parseData = localStorageData ? JSON.parse(localStorageData) : [];

                if (parseData.length > 0 && !isAllDataLoad) {

                    setLoading(true);
                    const limit = 15;
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                    const limitSliceData = parseData.slice(startIndex, endIndex);

                    if (limitSliceData.length === 0) {
                        setIsAllDataLoad(true);
                        return;
                    }

                    const response = await axios.post(`${appConfig.backendUrl}/api/v1/user/watch_later`, {
                        watchLater: limitSliceData,
                        limit
                    });

                    if (response.status === 200 && response.data.length > 0) {
                        setWatchLaterData((prev) => [...prev, ...response.data]);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        //Prevent multiple fetch call on first mount
        if (visibility && isFirstRender.current && page === 1) {
            isFirstRender.current = false;
            fetchData();

            // call back if page change
        } else if (visibility && !isFirstRender.current && page !== 1) {
            fetchData();
        }

    }, [page, isAllDataLoad, visibility]);

    // Remove from watch list item by imdbId
    const removeWatchListItem = (event, imdbId) => {

        const localStorageData = safeLocalStorage.get('saved-movies-data');
        const parseData = localStorageData ? JSON.parse(localStorageData) : [];
        const index = parseData?.findIndex((data) => data.imdbId === imdbId);

        // if provided imdbId data is find so remove it from watchlater localStorage
        if (index !== -1) {
            // remove from array by splice method
            parseData.splice(index, 1);

            // hide this movie or series from list without change state
            const parentElement = event.currentTarget.closest('.group');
            const transitionEffect = "transform transition-all duration-500 ease-in-out translate-x-full";
            if (parentElement) {
                // creat item hidden effect
                parentElement.classList.add(...transitionEffect.split(' '));

                // get the data title for showing title in toast message
                const title = watchLaterData[index].title;
                creatToastAlert({
                    message: `Removed ${title} from Watch later`
                })
                setTimeout(() => {

                    // after slider remove effect hide it for replace another list item
                    parentElement.classList.add('hidden');

                    // update watchLaterData with new array without this item
                    const newData = watchLaterData.filter((data) => data.imdbId !== imdbId);
                    setWatchLaterData(newData);

                    /* check after remove is watchlater localStorage length is zero so
                  remove localStorage key from browser and also empty watchlater state for show empty message */
                    if (parseData.length === 0) {
                        safeLocalStorage.remove('saved-movies-data');
                        setWatchLaterData([]);
                    } else {
                        // update localStorage with new data
                        safeLocalStorage.set('saved-movies-data', JSON.stringify(parseData));
                    }
                }, 500);
            }

        };
    };

    const clearAll = () => {

        const cardContainer = moviesCardContauner.current;
        const cards = cardContainer?.children || [];

        const transitionEffect = "transform transition-all duration-300 ease-in-out translate-x-full";

        let intersectingCards = []; // Array to store the intersecting cards

        // Create an IntersectionObserver instance
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const card = entry.target;

                    intersectingCards.push(card); // Add the intersecting card to the array

                    // Apply effect with increasing delay for each viewport card
                    setTimeout(() => {
                        card.classList.add(...transitionEffect.split(' '));
                    }, index * 200); // Stagger delay by 200ms for each card

                    observer.unobserve(card); // Stop observing once animation starts
                }
            });
            // Once all entries are processed, trigger the final actions
            if (entries.length > 0) {

                // Clear state after all animations and transitions
                setTimeout(() => {
                    setWatchLaterData([]); // Clear the data state
                    if (safeLocalStorage.get('saved-movies-data')) {
                        safeLocalStorage.remove('saved-movies-data'); // Remove localStorage key from browser
                    }
                    creatToastAlert({
                        message: 'Cleared all movies and series from Watch later',
                    });
                }, intersectingCards.length * 300); // Time based only on intersecting cards
            }
        }, {
            threshold: 0.2 // Adjust threshold to detect when a card is in the viewport
        });

        // Observe each card in the container
        Array.from(cards).forEach((card) => {
            observer.observe(card);
        });
    };

    return (
        <ModelsController visibility={visibility} closeEvent={hideModel}>
            <div className="w-auto h-auto bg-white rounded-md shadow-2xl absolute top-12 border-gray-400 right-0 z-40 select-none">
                <div className="px-1.5 shadow-sm">
                <div className="flex justify-between items-center border-b border-b-slate-200">
                    {watchLaterData.length > 0 && (
                        <button onClick={clearAll} type="button" title="Clear all" className="text-xs font-medium text-rose-600 underline px-2 py-1">Clear</button>
                    )}
                    <div className="px-2 py-2 text-sm text-gray-800 font-bold inline">Watch later</div>
                    <button onClick={hideModel} type="button" title="Close" className="w-7 h-7 text-xl text-gray-700 font-semibold bg-slate-100 rounded-full">
                        <span className="sr-only">Close Watch later model button</span>
                        <i className="bi bi-x"></i>
                    </button>
                    
                   </div>
                   <small className="text-[10px] text-gray-600">Note: Saved items are lost if you clear browser data.</small>
                </div>
                <div className="w-72 h-[420px] overflow-y-scroll scrollbar-hidden">
                    {watchLaterData.length === 0 && loading ? (
                        <div className="w-full h-auto py-40 flex justify-center items-center">
                            <div className="text-rose-500 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {watchLaterData.length > 0 ? (
                                <div ref={moviesCardContauner}>
                                    {watchLaterData.map((data, index) => (
                                        <div key={data.imdbId}>
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ duration: 0.3, delay: index * 0.20 }}
                                                variants={{
                                                    hidden: { opacity: 0, translateX: -100 },
                                                    visible: { opacity: 1, translateX: 0 },
                                                }}>
                                                <Card data={data} remove={removeWatchListItem} />
                                            </motion.div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="w-full h-auto py-10 flex justify-center items-center">
                                            <div className="text-rose-500 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status">
                                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col justify-center items-center">
                                    <div className="w-10 h-10 bg-blue-50 flex justify-center items-center rounded-full">
                                        <i className="bi bi-inbox text-xl text-blue-700"></i>
                                    </div>
                                    <div className="my-2">
                                        <div className="text-sm font-bold text-center text-gray-800">Your Watch Later list is empty!</div>
                                        <div className="text-xs text-gray-500 text-center px-5 mt-1.5 font-medium">Add your favorites now and come back anytime to watch them!</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={bottomObserverElement}></div>
                </div>
            </div>
        </ModelsController>
    );
};

const Card = ({ data, remove }) => {

    const { imdbId, type, title, displayTitle, thumbnail, releaseYear, addAt, videoType, status } = data || {};

    return (
        <div className="w-auto h-auto px-2.5 py-2 border-b border-gray-300 hover:bg-slate-50 group flex items-center relative">
            <Link className="w-full h-fit flex gap-3 items-center" title={title + ' ' + releaseYear + ' ' + type} href={`/watch/${type}/${creatUrlLink(title)}/${imdbId.replace('tt', '')}`}>
                <div className="w-[70px] aspect-[4/5.5] border border-slate-200 rounded-sm flex-none">
                    <Image
                        priority
                        className="w-full h-full object-fill select-none pointer-events-none rounded-sm"
                        width={80}
                        height={80}
                        src={resizeImage(thumbnail, 'w200')}
                        alt={title || 'movie poster image'}
                        placeholder="blur"
                        blurDataURL={resizeImage(thumbnail, 'w200')}
                    />
                </div>
                <div className="flex flex-col gap-1 space-y-0.5">
                    <div className="text-gray-700 font-semibold text-[12px] leading-[14px] line-clamp-2 capitalize max-w-[150px]">
                    {displayTitle ? displayTitle : title}
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold">
                        {releaseYear}
                    </span>
                    <div className="text-xs text-gray-600 font-semibold flex gap-0.5 whitespace-nowrap">
                        Added on:<span className="text-[10px] text-gray-500 font-medium">
                            {formatDate(addAt)}
                        </span>
                    </div>
                    {videoType ? (
                        <div className={`absolute text-[10px] top-2 right-3 w-auto h-auto px-[3px] ${videoType === 'hd' ? "bg-rose-600" : "bg-gray-900"} bg-opacity-70 text-gray-100 text-cente font-semibold rounded-sm uppercase z-10`}>
                            {videoType}
                        </div>
                    ) : status === "coming soon" && (
                        <div className="absolute text-[10px] top-2 right-3 w-auto h-auto px-[3px] bg-orange-600 bg-opacity-70 text-gray-100 text-cente font-semibold rounded-sm uppercase z-10">
                            Upcoming
                        </div>
                    )}
                </div>
            </Link>
            <button
                onClick={(event) => remove(event, imdbId)}
                type="button"
                title="Remove"
                className="w-7 h-7 text-sm block md:hidden group-hover:block bg-gray-200 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-600 absolute -translate-y-1/4 right-2">
                <span className="sr-only">Delete</span>
                <i className="bi bi-trash"></i>
            </button>
        </div>
    )
};