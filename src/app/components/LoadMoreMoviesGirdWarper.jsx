'use client'

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreFetch } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import FilterModel from "./models/FilterModel";
import BacktoTopButton from "./BacktoTopButton";

function LoadMoreMoviesGirdWarper({ apiUrl, apiBodyData, limitPerPage, initialFilter, filterCounter, serverResponseExtraFilter, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const conditionalData = (loadMoviesPathname !== patname) ? (initialMovies || []) : loadMoviesData || [];
    const [moviesData, setMoviesData] = useState(conditionalData);
    const bottomObserverElement = useRef(null);

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

    const handleObservers = (entries) => {

        const target = entries[0];

        if (target.isIntersecting && !loading && !isAllDataLoad) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: "200px",
            threshold: 1.0,
        });

        if (bottomObserverElement.current && moviesData?.length > 0 && !loading) {
            observer.observe(bottomObserverElement.current);
        };

        return () => {
            if (bottomObserverElement.current) {
                observer.unobserve(bottomObserverElement.current);
            }
        };
    }, [moviesData, loading, handleObservers]);

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

            {initialMovies.length > 20 && initialFilter && (
                <FilterModel
                    initialFilterData={initialFilter}
                    filterData={filterData}
                    filterCounter={filterCounter}
                    extraFilter={serverResponseExtraFilter}
                    functions={{
                        setFilter
                    }} />
            )}

            <BacktoTopButton postion="mobile:top-20 top-24" />

        </>
    );
};

export default LoadMoreMoviesGirdWarper;

