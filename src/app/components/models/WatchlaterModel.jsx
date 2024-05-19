import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ModelsController } from "@/lib/EventsHandler";
import { appConfig } from "@/config/config";
import { creatUrlLink } from "@/utils";

function formatDate(dateString) {
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

function WatchlaterModel({ visibility, functions }) {
    const { hideModel } = functions;
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [watchLaterData, setWatchLaterData] = useState([]);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);
    const bottomObserverElement = useRef(null);

    const handleObservers = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !isAllDataLoad) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, isAllDataLoad]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: "10px",
            threshold: 1.0,
        });

        if (bottomObserverElement.current) {
            observer.observe(bottomObserverElement.current);
        }

        return () => {
            if (bottomObserverElement.current) {
                observer.unobserve(bottomObserverElement.current);
            }
        };
    }, [handleObservers]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const localStorageData = localStorage.getItem('saved-movies-data');
                const parseData = localStorageData ? JSON.parse(localStorageData) : [];

                if (parseData.length > 0 && !isAllDataLoad) {

                    setLoading(true);
                    const limit = 6;
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

    return (
        <ModelsController visibility={visibility} closeEvent={hideModel}>
            <div className="w-auto h-auto bg-white rounded-md shadow-2xl absolute top-12 border border-gray-400 right-0 z-40 select-none">
                <div className="px-2 py-2 text-sm text-gray-800 font-semibold border-b border-b-slate-200">Watch later</div>
                <div className="w-72 h-96 overflow-y-scroll scrollbar-hidden">
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
                                <>
                                    {watchLaterData.map((data) => (
                                        <div key={data.imdbId} className="w-auto h-auto px-2.5 py-2 border-b border-gray-300 hover:bg-slate-50">
                                            <Link className="flex gap-3 items-center" href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId.replace('tt', '')}`}>
                                                <div className="w-16 h-20 border border-slate-200 rounded-sm">
                                                    <Image
                                                        priority
                                                        className="w-full h-full object-fill select-none pointer-events-none rounded-sm"
                                                        width={80}
                                                        height={80}
                                                        src={data.thambnail}
                                                        alt={data.title || 'movie thumbnail'}
                                                        placeholder="blur"
                                                        blurDataURL={data.thambnail}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-gray-800 font-medium text-[12px] leading-[14px] line-clamp-2">
                                                        {data.title}
                                                    </div>
                                                    <span className="text-[10px] text-gray-500">
                                                        {data.releaseYear}
                                                    </span>
                                                    <div className="text-xs text-gray-900 flex gap-0.5">
                                                        Add at:
                                                        <span className="text-[10px] text-gray-500">
                                                            {formatDate(data.addAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
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
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col justify-center items-center">
                                    <div className="w-10 h-10 bg-blue-50 flex justify-center items-center rounded-full">
                                        <i className="bi bi-inbox text-xl text-blue-700"></i>
                                    </div>
                                    <div className="text-sm text-blue-900 text-center">You Not have any save movies</div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={bottomObserverElement}></div>
                </div>
            </div>
        </ModelsController>
    );
}

export default WatchlaterModel;
