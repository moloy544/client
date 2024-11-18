'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreFetch } from "@/utils";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import FilterModel from "./models/FilterModel";
import BacktoTopButton from "./BacktoTopButton";
import { useInfiniteScroll } from "@/hooks/observers";
import { MovieCardSkleaton, ResponsiveMovieCard } from "./cards/Cards";


function LoadMoreMoviesGirdWarper({ title, apiUrl, apiBodyData, limitPerPage, initialFilter, serverResponseExtraFilter, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const conditionalData = (loadMoviesPathname !== patname) ? (initialMovies || []) : loadMoviesData || [];
    const [moviesData, setMoviesData] = useState(conditionalData);

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    // infinite scroll load data custom hook
    const bottomObserverElement = useInfiniteScroll({
        callback: loadMore,
        loading,
        isAllDataLoad,
        rootMargin: '300px'
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

    }, [isAllDataLoad, loadMoviesPathname, patname, page, filterData, initialMovies, limitPerPage, initialFilter, isDataEnd, apiUrl, apiBodyData]);

    return (
        <>
            <main className="w-full h-auto bg-transparent overflow-x-hidden">
                {title && (
                    <div className="bg-gray-900 py-1.5 px-2 border-t border-t-gray-800">
                        <h1 className="text-center font-bold text-[#dcdcde] text-base mobile:text-xs line-clamp-1">{title}</h1>
                    </div>
                )}
                <div className="w-auto h-fit gap-1.5 mobile:gap-1 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] px-2 py-3 mobile:py-2">

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

                    {!loading && moviesData.length === 0 && (
                        <div className="my-40 text-gray-400 text-xl mobile:text-base text-center font-semibold">
                            We are not found anything
                        </div>
                    )}
                </div>

                {loading && moviesData.length > 0 && (
                    <div className="w-full h-auto mobile:py-6 py-10 flex justify-center items-center">
                        <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...</span>
                        </div>
                    </div>
                )}

                <div className="w-full h-2" ref={bottomObserverElement}></div>

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

