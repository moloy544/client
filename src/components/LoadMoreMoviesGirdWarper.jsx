'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isMobileDevice, loadMoreFetch } from "@/utils";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import FilterModel from "./modals/FilterModel";
import BacktoTopButton from "./buttons/BacktoTopButton";
import { MovieCardSkleaton, ResponsiveMovieCard } from "./cards/Cards";
import { useInfiniteScroll } from "@/hooks/observers";

const LoadContentError = dynamic(() => import('@/components/errors/LoadContentError'), { ssr: false });

function LoadMoreMoviesGirdWarper({ title, description, apiUrl, apiBodyData, limitPerPage, initialFilter, serverResponseExtraFilter, initialMovies, isDataEnd, apiError = false }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const conditionalData = (loadMoviesPathname !== patname) ? (initialMovies || []) : loadMoviesData || [];
    const [moviesData, setMoviesData] = useState(conditionalData);

    // Inifinity scroll for load more data on scroll down
    const observerElement = useInfiniteScroll({
        rootMargin: '150px',
        isAllDataLoad,
        callback: () => setPage((prevPage) => prevPage + 1)
    });

    const setFilter = (data) => {

        if (!loading) {
            setMoviesData([]);
            setPage(2);
            dispatch(updateLoadMovies({
                loadMoviesData: [],
                filterData: data,
                isAllDataLoad: false
            }));

            window.scrollTo({
                top: 0,
                behavior: 'instant',
            });
        };
    };

    useEffect(() => {

        if (apiError || !initialMovies || initialMovies.length === 0) return;

        //First component mount store page initial data and current path name in redux store
        if (loadMoviesPathname !== patname) {

            dispatch(updateLoadMovies({
                loadMoviesPathname: patname,
                loadMoviesData: initialMovies || [],
                filterData: { ...initialFilter },
                isAllDataLoad: isDataEnd || false
            }));
        };

        //Load more movies 
        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 1 && !loading) {

            const loadMoreData = async () => {

                try {

                    setLoading(true);

                    //If filter data is empty bofore call api set initial filter and return for exit
                    const isFilterDataEmpty = (Object.keys(filterData).length === 0);

                    if (isFilterDataEmpty) {

                        setFilter(initialFilter);
                        return;
                    };

                    const { status, data, dataIsEnd } = await loadMoreFetch({
                        apiPath: apiUrl,
                        bodyData: {
                            filterData: isFilterDataEmpty ? initialFilter : filterData,
                            ...apiBodyData
                        },
                        page,
                        limitPerPage,
                        skip: moviesData.length,
                    });

                    if (status === 200) {

                        dispatch(updateLoadMovies({
                            loadMoviesData: [...loadMoviesData, ...data.moviesData]
                        }));

                        setMoviesData((prevData) => [...prevData, ...data.moviesData]);
                    };

                    if (dataIsEnd) {
                        dispatch(updateLoadMovies({ isAllDataLoad: true }));
                    };

                } catch (error) {
                    console.log(error);
                } finally {

                    setLoading(false);
                };
            };

            loadMoreData();
        };

    }, [isAllDataLoad, loadMoviesPathname, patname, page, filterData, initialMovies, limitPerPage, initialFilter, isDataEnd, apiUrl, apiBodyData, apiError]);

    return (
        <>
            <main className="w-full h-auto bg-transparent overflow-x-hidden">
                {title && (
                    <div className="bg-gray-900 py-1.5 px-2 border-t border-t-gray-800">
                        <h1 className="text-center font-bold text-[#c5c5c6] text-base mobile:text-xs line-clamp-1">{title}</h1>
                        {description && (
                            <p className="text-center text-gray-400 text-xs mobile:text-[10px] font-semibold line-clamp-1">{description}</p>
                        )}
                    </div>
                )}
                {!apiError ? (

                    <div className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] px-2 py-3 mobile:py-2">

                        {moviesData.length > 0 && (
                            moviesData.map((movie, index) => (
                                <ResponsiveMovieCard
                                    key={movie.imdbId || index}
                                    data={movie}
                                />
                            )))}

                        {loading && moviesData.length === 0 && (
                            <MovieCardSkleaton limit={limitPerPage} />
                        )}

                        {!loading && initialMovies.length === 0 ? (
                            <h2 className="my-40 text-center text-xl mobile:text-base font-semibold text-gray-200">
                                Sorry, there&lsquo;s no content available at the moment. Please check back later.
                            </h2>

                        ) : !loading && moviesData.length === 0 && (
                            <div className="my-40 flex flex-col items-center">
                                <span className="text-gray-400 text-xl mobile:text-base text-center font-semibold">
                                    No results found for the applied filter.
                                </span>
                                <button
                                    onClick={() => setFilter(initialFilter)}
                                    type="button"
                                    className="mt-4 px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-medium text-sm rounded transition-all duration-200"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="w-full h-full min-h-[450px] bg-custom-dark-bg flex items-center justify-center">
                        <LoadContentError
                            errorDescription="We are unable to load the movies right now. Please try refreshing the page or come back later."
                            customRefreshFunction={() => window.location.reload()}
                            customRefreshTitle="Reload Page"
                        />
                    </div>
                )}

                {loading && moviesData.length > 0 && (
                    <div className="w-full h-auto mobile:py-6 py-10 flex justify-center items-center">
                        <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...</span>
                        </div>
                    </div>
                )}

                <div className="w-full h-2" ref={observerElement}></div>

            </main >

            {initialMovies && initialMovies.length >= 30 && initialFilter && (
                <FilterModel
                    initialFilterData={initialFilter}
                    filterData={filterData}
                    filterOptions={serverResponseExtraFilter}
                    functions={{
                        setFilter
                    }} />
            )
            }

            <BacktoTopButton postion="mobile:top-20 top-24" />
        </>
    );
};

export default LoadMoreMoviesGirdWarper;

