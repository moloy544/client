'use client'
import { useEffect, useRef, useState } from "react";
import { fetchLoadMoreMovies } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";
import { useDispatch, useSelector } from "react-redux";
import { updateLoadMovies } from "@/context/loadMoviesState/loadMoviesSlice";
import { usePathname } from "next/navigation";

function LoadMoreMoviesGirdWarper({ apiUrl, initialPage, initialMovies, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadMoviesPathname, isAllDataLoad, loadMoviesData } = useSelector((state) => state.loadMovies);
   
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(initialPage || 1);
    const [endOfData, setEndOfData] = useState(isDataEnd || false);
    const moviesData = loadMoviesPathname !== patname ? initialMovies || [] : loadMoviesData;

    const observerRef = useRef(null);

    //Set movies data 
    useEffect(() => {

        if (loadMoviesPathname !== patname) {

            dispatch(updateLoadMovies({
                loadMoviesPathname: patname,
                loadMoviesData: initialMovies || [],
                isAllDataLoad: false
            }));
        };

    }, [patname, loadMoviesPathname]);


    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "200px",
            threshold: 1.0,
        });

        if (moviesData?.length > 0) {
            observerRef.current.observe(
                document.getElementById("bottom_observerElement")
            );
        };

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [moviesData]);

    useEffect(() => {

        if (!isAllDataLoad && loadMoviesPathname === patname && page !== 1) {

            const getMovies = async () => {

                setLoading(true);

                setEndOfData(false);

                const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
                    apiPath: apiUrl,
                    limitPerPage: initialMovies?.length,
                    page: page,
                });

                dispatch(updateLoadMovies({ loadMoviesData: [...loadMoviesData, ...filterResponse] }));

                if (dataIsEnd) {
                    setEndOfData(true);
                    dispatch(updateLoadMovies({ isAllDataLoad: true }));
                }

                setLoading(false);
            };

            getMovies();

        };

    }, [page]);

    return (
        <main className="w-full h-auto bg-transparent py-1 overflow-x-hidden">

            <div className="w-auto h-fit gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] px-2">

                <LoadMoreMoviesCard limit={initialMovies?.length || 25} isLoading={loading} moviesData={moviesData} />

            </div>

            <div id="bottom_observerElement" ref={observerRef}></div>

        </main>
    );
};

export default LoadMoreMoviesGirdWarper;



