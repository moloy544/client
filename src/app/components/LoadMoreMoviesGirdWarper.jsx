'use client'

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreFetch } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";

function LoadMoreMoviesGirdWarper({ apiUrl, initialFilter, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, filterData, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const conditionalData = (page === 0 && loadMoviesPathname !== patname) ? (initialMovies || []) : (page === 0 && loadMoviesData);
    const [moviesData, setMoviesData] = useState(conditionalData);

    const observerRefElement = useRef(null);

    const addFilter = (filterType, value) => {

        setMoviesData([]);

        window.scrollTo(0, 0);

        setPage(1);

        dispatch(updateLoadMovies({
            loadMoviesData: [],
            filterData: { [filterType]: value },
            isAllDataLoad: false
        }));

    };

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            const target = entries[0];

            if (target.isIntersecting && !loading && !isAllDataLoad) {
                setPage((prevPage) => prevPage + 1);
            }
        }, {
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
    }, [moviesData, loading, isAllDataLoad]);

    useEffect(() => {

        //First component mount set states
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
                        bodyData: {filterData},
                        limitPerPage: initialMovies.length,
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

                    <LoadMoreMoviesCard limit={initialMovies.length} isLoading={loading} moviesData={moviesData} />

                </div>

                <div className="w-full h-2" ref={observerRefElement}></div>

            </main>

            {initialFilter && (
                <FilterDropDown data={{ addFilter, filterData }} />
            )}

        </>
    );
};

export default LoadMoreMoviesGirdWarper;

function FilterDropDown({ data }) {

    const [visible, setVisible] = useState(false);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false)
    };

    const { addFilter, filterData } = data;

    const sortFilerOptions = [
        {
            title: 'date-new-to-old',
            filterName: 'dateSort',
            filterValue: -1,
            filterLabel: 'Date new to old'
        },
        {
            title: 'date-old-to-new',
            filterName: 'dateSort',
            filterValue: 1,
            filterLabel: 'Date old to new'
        },
        {
            title: 'rating-high-to-low',
            filterName: 'ratingSort',
            filterValue: -1,
            filterLabel: 'Rating high to low'
        },
    ];

    return (

        <div className={`w-auto h-auto py-1 px-2 border fixed top-20 mobile:top-16 right-5 z-20 shadow-2xl ${visible ? "bg-white text-gray-900 border-gray-500 rounded-md" : "bg-rose-600 text-gray-100 border-rose-500 rounded-full"}`}>

            {visible ? (
                <>
                    <div className="w-full h-auto flex justify-between items-center">

                        <div className="text-sm text-black font-bold">Filter options</div>

                        <i onClick={hide} className="bi bi-x text-xl cursor-pointer"></i>
                    </div>

                    <div className="py-2">
                        {sortFilerOptions.map((data, index) => (
                            <div key={index} className="py-1.5 flex items-center gap-1">
                                <input onChange={() => addFilter(data.filterName, data.filterValue)} id={data.title} type="radio" name="filter" className="h-0 w-0 opacity-0 absolute" checked={filterData[data.filterName] === data.filterValue} />
                                <label htmlFor={data.title} className={`text-xs ${filterData[data.filterName] === data.filterValue ? "text-gray-900 font-semibold": "text-gray-700 font-medium"} hover:cursor-pointer relative flex items-center cursor-pointer`}>
                                    <div className={`h-4 w-4 border border-rose-300 rounded-full flex items-center justify-center mr-2 ${filterData[data.filterName] === data.filterValue && "bg-rose-500 border-rose-500"}`}>
                                        {filterData[data.filterName] === data.filterValue && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                    </div>
                                    {data.filterLabel}
                                </label>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <i onClick={show} className="bi bi-filter text-xl cursor-pointer"></i>
            )}

        </div>
    )
}