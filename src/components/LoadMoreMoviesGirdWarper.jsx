'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreFetch } from "@/utils";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import FilterModel from "./models/FilterModel";
import BacktoTopButton from "./BacktoTopButton";
import { useInfiniteScroll } from "@/lib/lib";

function LoadMoreMoviesGirdWarper({ apiUrl, apiBodyData, limitPerPage, initialFilter, serverResponseExtraFilter, initialMovies, isDataEnd }) {

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
        rootMargin: '200px'
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
                top:0,
                 behavior: 'instant',
             });
        };
    };

    useEffect(() => {

        //First component mount set states in redux store
        if (loadMoviesPathname !== patname) {

            dispatch(updateLoadMovies({
                loadMoviesPathname: patname,
                loadMoviesData: initialMovies || [],
                filterData: { ...initialFilter },
                isAllDataLoad: isDataEnd || false
            }));
        };

        //Load more movies 
        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 1&& !loading) {

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

    }, [isAllDataLoad, loadMoviesPathname, patname, page, filterData, initialMovies, initialFilter, isDataEnd, apiUrl]);


    return (
        <>
            <main className="w-full h-auto bg-transparent py-1 overflow-x-hidden">

                <div className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2">

                    <LoadMoreMoviesCard limit={limitPerPage} isLoading={loading} moviesData={moviesData} />

                    {!loading && moviesData.length === 0 && (
                        <div className="my-40 text-gray-400 text-xl mobile:text-base text-center font-semibold">
                            We are not found anything
                        </div>
                    )}
                </div>

                <div className="w-full h-2" ref={bottomObserverElement}></div>

            </main>

            {initialMovies.length >= 30 && initialFilter && (
                <FilterModel
                    initialFilterData={initialFilter}
                    filterData={filterData}
                    filterOptions={serverResponseExtraFilter}
                    functions={{
                        setFilter
                    }} />
            )}

            <BacktoTopButton postion="mobile:top-20 top-24" />

        </>
    );
};

export default LoadMoreMoviesGirdWarper;

