'use client'
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoadMoreMovies } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";

function LoadMoreMoviesGirdWarper({ apiUrl, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, loadMoviesData } = useSelector((state) => state.loadMovies);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [endOfData, setEndOfData] = useState(isDataEnd || false);
    const conditionalData = (page === 1 && loadMoviesPathname !== patname) ? (initialMovies || []) : (page === 1 && loadMoviesData);
    const [moviesData, setMoviesData] = useState(conditionalData);

    const observerRefElement = useRef(null);

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "200px",
            threshold: 1.0,
        });

        if (observerRefElement.current && moviesData?.length > 0 && !loading) {
            observer.observe(observerRefElement.current);
        };

        if (observerRefElement.current && endOfData) {
            observer.unobserve(observerRefElement.current);
        };

        return () => {
            if (observerRefElement.current) {
                observer.unobserve(observerRefElement.current);
            }
        };
    }, [moviesData, loading, endOfData]);

    useEffect(() => {

        //First component mount set states
        if (loadMoviesPathname !== patname) {

            dispatch(updateLoadMovies({
                loadMoviesPathname: patname,
                loadMoviesData: initialMovies || [],
                isAllDataLoad: isDataEnd || false
            }));
        };

        //Load more movies 
        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 1) {

            const loadMoreData = async () => {

                try {

                    setLoading(true);

                    const { status, filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
                        apiPath: apiUrl,
                        limitPerPage: initialMovies.length,
                        skip: moviesData?.length,
                    });

                    if (status === 200) {

                        dispatch(updateLoadMovies({ loadMoviesData: [...loadMoviesData, ...filterResponse] }));

                        setMoviesData((prevData) => [...prevData, ...filterResponse]);
                    };

                    if (dataIsEnd) {
                        setEndOfData(true);
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

    }, [isAllDataLoad, loadMoviesPathname, patname, page, initialMovies, isDataEnd, apiUrl]);


    return (

        <main className="w-full h-auto bg-transparent py-1 overflow-x-hidden">

            <div className="w-auto h-fit gap-2 mobile:gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2">

                <LoadMoreMoviesCard limit={20} isLoading={loading} moviesData={moviesData} />

            </div>

            <div className="w-full h-2" ref={observerRefElement}></div>

        </main>
    );
};

export default LoadMoreMoviesGirdWarper;