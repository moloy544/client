'use client'
import { appConfig } from "@/config/config";
import { useEffect, useRef, useState } from "react";
import MoviesCardsGirdWarper from "./MoviesCardsGirdWarper";
import { fetchMoviesFromServer } from "@/utils";

function MoviesSection({ query, initialMovies, isDataEnd }) {

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
            <main className="w-full h-auto bg-gray-100 my-2">
                <MoviesCardsGirdWarper
                    isLoading={loading}
                    moviesData={moreMoviesData}
                />
                <div id="bottom_observerElement" ref={observerRef}></div>

            </main>
    );
};

export default MoviesSection;
