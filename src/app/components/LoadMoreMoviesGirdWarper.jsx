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
    const moviesData = (loadMoviesPathname !== patname) ? (initialMovies || []) : loadMoviesData;

    const observerRef = useRef(null);


    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1)
        }
    };

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        });

        if (moviesData?.length > 0) {
            console.log(" i observ")
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
                        limitPerPage: initialMovies?.length,
                        skip: moviesData?.length,
                    });

                    if (status === 200) {

                        dispatch(updateLoadMovies({ loadMoviesData: [...moviesData, ...filterResponse] }));

                        if (dataIsEnd) {
                            setEndOfData(true);
                            dispatch(updateLoadMovies({ isAllDataLoad: true }));
                        };
                    };

                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false)
                };
            };

            loadMoreData();

        };

    }, [isAllDataLoad, loadMoviesPathname, patname, page, initialMovies, isDataEnd]);

    return (
        <main className="w-full h-auto bg-transparent py-1 overflow-x-hidden">

            <div className="w-auto h-fit gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] px-2">

                <LoadMoreMoviesCard limit={20} isLoading={loading} moviesData={moviesData} />

            </div>

            <div id="bottom_observerElement" ref={observerRef}></div>

        </main>
    );
};

export default LoadMoreMoviesGirdWarper;


