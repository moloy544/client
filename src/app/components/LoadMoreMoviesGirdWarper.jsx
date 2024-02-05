'use client'

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberCounter, loadMoreFetch } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import { categoryArray, moviesGenreArray } from "@/constant/constsnt";

function LoadMoreMoviesGirdWarper({ apiUrl, apiBodyData, limitPerPage, initialFilter, filterCounter, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const conditionalData = (page === 1 && loadMoviesPathname !== patname) ? (initialMovies || []) : (page === 1 && loadMoviesData);
    const [moviesData, setMoviesData] = useState(conditionalData);

    const bottomObserverElement = useRef(null);

    const addFilter = (filterGroup, filterName, filterItem) => {

        setMoviesData([]);

        window.scrollTo(0, 0);

        setPage(2);

        dispatch(updateLoadMovies({
            loadMoviesData: [],
            filterData: {
                ...filterData,
                [filterGroup]: { [filterName]: filterItem }
            },
            isAllDataLoad: false
        }));

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
    }, [moviesData, loading, isAllDataLoad, handleObservers]);

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
        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 1) {

            const loadMoreData = async () => {

                try {

                    setLoading(true);

                    const { status, data, dataIsEnd } = await loadMoreFetch({
                        apiPath: apiUrl,
                        bodyData: {
                            filterData,
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
                <FilterDropDown
                    filterData={filterData}
                    filterCounter={filterCounter}
                    filterFunctions={{
                        addFilter
                    }} />
            )}

        </>
    );
};

export default LoadMoreMoviesGirdWarper;

function FilterDropDown({ filterData, filterCounter, filterFunctions }) {

    const [visible, setVisible] = useState(false);

    const showModel = () => {
        setVisible(true);
    };

    const hideModel = () => {
        setVisible(false)
    };

    const { addFilter } = filterFunctions;

    const { sortFilter, categoryFilter } = filterData;

    const sortFilerOptions = [
        {
            filterLabel: 'Date new to old',
            filterName: 'dateSort',
            filterData: -1
        },
        {
            filterLabel: 'Date old to new',
            filterName: 'dateSort',
            filterData: 1
        },
        {
            filterLabel: 'Rating high to low',
            filterName: 'ratingSort',
            filterData: -1
        },
    ];

    const findCategory = categoryArray.find(c => c.name === "Movie");

    if (!findCategory) {
        categoryArray.splice(4, 0, {
            id: 15,
            name: "Movie"
        });
    };

    const categeoryFilterOptions = [
        {
            filterTitle: ' Filter by category',
            filterName: 'category',
            filterData: categoryArray
        },
        {
            filterTitle: 'Filter by genre',
            filterName: 'genre',
            filterData: moviesGenreArray
        }
    ];

    return (

        <div className={`w-auto h-auto bg-white fixed top-20 mobile:top-16 right-5 z-20 border border-gray-300 shadow-2xl ${visible ? "py-1 rounded-md" : "px-2 flex items-center rounded-2xl"} select-none`}>

            {!(visible) ? (

                <div onClick={showModel} className="text-gray-900 font-semibold flex items-center gap-1 cursor-pointer">
                    <i className="bi bi-filter text-2xl"></i>
                    <span className="text-xs">Filter</span>
                </div>

            ) : (
                <>
                    <div className="w-full h-auto flex justify-between items-center px-2">

                        <div className="text-sm text-black font-bold">Sort options</div>

                        <i onClick={hideModel} className="bi bi-x text-xl cursor-pointer"></i>
                    </div>

                    <div className="w-56 h-auto">

                        {sortFilerOptions.map((data, index) => (

                            <div key={index} onClick={() => addFilter('sortFilter', data.filterName, data.filterData)} className="py-1 px-3 flex items-center gap-2 cursor-pointer">

                                <i className={`text-base ${sortFilter[data.filterName] === data.filterData ? "bi bi-check-circle-fill text-red-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>

                                <div className={`text-xs ${sortFilter[data.filterName] === data.filterData ? "text-gray-700 font-semibold" : "text-gray-600 font-medium"} transition-all duration-500 ease-in-out`}>
                                    {data.filterLabel}
                                </div>

                            </div>
                        ))}

                        {categeoryFilterOptions.map((filter, index) => (

                            <div key={index} className="w-auto h-auto my-1">

                                {categoryFilter[filter.filterName] && (

                                    <>
                                        <div className=" px-2 text-gray-800 text-sm font-bold py-1">
                                            {filter.filterTitle}
                                        </div>

                                        <div className="w-auto h-auto max-h-60 overflow-y-scroll scrollbar-hidden">

                                            <div onClick={() => addFilter('categoryFilter', filter.filterName, "all")} className={`flex justify-between items-center text-xs font-medium ${categoryFilter[filter.filterName] === "all" ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                {filterCounter && filterCounter.totalCount ? (
                                                    <span>All {` (${formatNumberCounter(filterCounter.totalCount)})`}</span>

                                                ) : (
                                                    <span>All</span>
                                                )}
                                                <i className={`text-base ${categoryFilter[filter.filterName] === "all" ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                            </div>

                                            {filter.filterData?.map((data) => (

                                                <React.Fragment key={data.name}>
                                                    {filterCounter ? (
                                                        filterCounter[filter.filterName]
                                                            .filter(({ filterName }) => filterName === data.name)
                                                            .map(({ count }) => (

                                                                <div key={data.name} onClick={() => count !== 0 && addFilter('categoryFilter', filter.filterName, data.name)} className={`flex justify-between items-center text-xs font-medium ${categoryFilter[filter.filterName] === data.name ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                                    <span>{data.name + ` (${count})`}</span>
                                                                    <i className={`text-base ${categoryFilter[filter.filterName] === data.name ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                                </div>
                                                            ))
                                                    ) : (
                                                        <div onClick={() => addFilter('categoryFilter', filter.filterName, data.name)} key={data.id} className={`flex justify-between items-center text-xs font-medium ${categoryFilter[filter.filterName] === data.name ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                            <span>{ data.name ==="New release" ? "Latest" : data.name}</span>
                                                            <i className={`text-base ${categoryFilter[filter.filterName] === data.name ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                        </div>
                                                    )}

                                                </React.Fragment>

                                            ))}

                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                    </div>
                </>
            )}

        </div>
    )
}