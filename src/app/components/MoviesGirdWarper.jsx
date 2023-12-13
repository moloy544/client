'use client'
import { appConfig } from "@/config/config";
import { useEffect, useRef, useState } from "react";
import MoviesCard from "./MoviesCard";
import { fetchMoviesFromServer } from "@/utils";

function MoviesGirdWarper({ query, initialMovies, isDataEnd }) {

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moreMoviesData, setMoreMoviesData] = useState(initialMovies || []);
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
            rootMargin: "10px",
            threshold: 1.0,
        });

        if (moreMoviesData.length > 0) {
            observerRef.current.observe(
                document.getElementById("bottom_observerElement")
            );
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [moreMoviesData]);

    useEffect(() => {

        if (page !== 1) {

            const getMovies = async () => {
                setLoading(true);
                setEndOfData(false);

                const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
                    apiPath: `${appConfig.backendUrl}/api/v1/movies/get/${query}`,
                    limitPerPage: 20,
                    page: page,
                });

                setMoreMoviesData((prevData) => [...prevData, ...filterResponse]);

                if (dataIsEnd) {
                    setEndOfData(true);
                }

                setLoading(false);
            };

            getMovies();

        }

    }, [page]);

    return (
        <main className="w-full h-auto bg-cyan-50 py-3 mobile:py-2 overflow-x-hidden">

            <div className="w-full h-auto mobile:my-1 px-2 gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] overflow-x-hidden">

                <MoviesCard isLoading={loading} moviesData={moreMoviesData} />

            </div>
            <div id="bottom_observerElement" ref={observerRef}></div>
        </main>
    );
};

export default MoviesGirdWarper;
