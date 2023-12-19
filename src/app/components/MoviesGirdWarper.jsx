'use client'
import { useEffect, useRef, useState } from "react";
import { fetchLoadMoreMovies } from "@/utils";
import LoadMoreMoviesCard from "./LoadMoreMoviesCard";

function MoviesGirdWarper({ apiUrl, initialMovies, isDataEnd }) {

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState(initialMovies || []);
    const [endOfData, setEndOfData] = useState(isDataEnd || false);

    const observerRef = useRef(null);

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

        if (moviesData.length > 0) {
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

        if (page !== 1) {

            const getMovies = async () => {
                setLoading(true);
                setEndOfData(false);

                const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
                    apiPath: apiUrl,
                    limitPerPage: initialMovies?.length,
                    page: page,
                });

                setMoviesData((prevData) => [...prevData, ...filterResponse]);

                if (dataIsEnd) {
                    setEndOfData(true);
                }

                setLoading(false);
            };

            getMovies();

        };

    }, [page]);

    return (
        <main className="w-full h-auto bg-transparent py-1 overflow-x-hidden">

            <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(135px,1fr))] gap-[6px] mobile:gap-1  mobile:my-1 px-1.5 overflow-x-hidden">

                <LoadMoreMoviesCard isLoading={loading} moviesData={moviesData} />

            </div>
            <div id="bottom_observerElement" ref={observerRef}></div>
        </main>
    );
};

export default MoviesGirdWarper;



