'use client'

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreFetch } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import { categoryArray, moviesGenreArray } from "@/constant/constsnt";

function LoadMoreMoviesGirdWarper({ apiUrl, apiBodyData, limitPerPage, initialFilter, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const conditionalData = (page === 0 && loadMoviesPathname !== patname) ? (initialMovies || []) : (page === 0 && loadMoviesData);
    const [moviesData, setMoviesData] = useState(conditionalData);

    const observerRefElement = useRef(null);

    const addFilter = (filterGroup, filterName, filterItem) => {

        setMoviesData([]);

        window.scrollTo(0, 0);

        setPage(1);

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

        if (observerRefElement.current && moviesData?.length > 0 && !loading) {
            observer.observe(observerRefElement.current);
        };

        return () => {
            if (observerRefElement.current) {
                observer.unobserve(observerRefElement.current);
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
        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 0) {

            const loadMoreData = async () => {

                try {

                    setLoading(true);

                    const { status, filterResponse, dataIsEnd } = await loadMoreFetch({
                        apiPath: apiUrl,
                        bodyData: {
                            filterData,
                            ...apiBodyData
                        },
                        limitPerPage,
                        skip: moviesData.length,
                    });

                    if (status === 200) {

                        dispatch(updateLoadMovies({
                            loadMoviesData: [...loadMoviesData, ...filterResponse]
                        }));

                        setMoviesData((prevData) => [...prevData, ...filterResponse]);
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

                <div className="w-full h-2" ref={observerRefElement}></div>

            </main>

            {initialMovies.length>0 && initialFilter && (
                <FilterDropDown
                    filterData={filterData}
                    filterFunctions={{
                        addFilter
                    }} />
            )}

        </>
    );
};

export default LoadMoreMoviesGirdWarper;

function FilterDropDown({ filterData, filterFunctions }) {

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

        <div className={`w-auto h-auto bg-white fixed top-20 mobile:top-16 right-5 z-20 border border-gray-300 shadow-2xl ${visible ? "py-1 rounded-md" : "px-2 rounded-2xl"}`}>

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

                    <div className="w-52 h-auto">

                        {sortFilerOptions.map((data, index) => (

                            <div key={index} onClick={() => addFilter('sortFilter', data.filterName, data.filterData)} className="py-2 px-2 flex gap-2 items-center cursor-pointer">

                                <i className={`text-sm ${sortFilter[data.filterName] === data.filterData ? "bi bi-check-circle-fill text-red-500" : "bi bi-circle text-gray-400"}`}></i>

                                <div className={`text-xs ${sortFilter[data.filterName] === data.filterData ? "text-gray-900 font-semibold" : "text-gray-800 font-medium"}`}>
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

                                            <div onClick={() => addFilter('categoryFilter', filter.filterName, "all")} className={`flex justify-between items-center text-xs font-medium ${categoryFilter[filter.filterName] === "all" ? "bg-blue-100 text-blue-500" : "text-gray-600 hover:bg-gray-100"} my-1 py-1 px-2.5 cursor-pointer`}>
                                                <div>All</div>
                                                <i className={`text-sm ${categoryFilter[filter.filterName] === "all" ? "bi bi-check-circle-fill" : "bi bi-circle text-blue-300"}`}></i>
                                            </div>

                                            {filter.filterData?.map((data) => (
                                                <div onClick={() => addFilter('categoryFilter', filter.filterName, data.name)} key={data.id} className={`flex justify-between items-center text-xs font-medium ${categoryFilter[filter.filterName] === data.name ? "bg-blue-100 text-blue-500" : "text-gray-600 hover:bg-gray-100"} my-1 py-1 px-2.5 cursor-pointer`}>
                                                    <div>{data.name}</div>
                                                    <i className={`text-sm ${categoryFilter[filter.filterName] === data.name ? "bi bi-check-circle-fill" : "bi bi-circle text-blue-300"}`}></i>
                                                </div>
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