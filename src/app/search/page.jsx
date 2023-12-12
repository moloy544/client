'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import Link from "next/link";
import { appConfig } from "@/config/config";
import { fetchMoviesFromServer } from "../../utils";
import MoviesCardsGirdWarper from "../components/MoviesCardsGirdWarper";

function SearchPage() {

    // Set all state
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [moviesData, setMoviesData] = useState([]);
    const [endOfData, setEndOfData] = useState(false);

    const observerRef = useRef(null);

    const handleSearch = (event) => {

        setTimeout(() => {

            const trimValue = event.target.value.replace(/ +/g, ' ');

            // Update the controlled input value in state
            if (trimValue !== ' ') {

                setSearchQuery(trimValue);
                setPage(1);
                setEndOfData(false);
                setMoviesData([])
            };

        }, 800);

    };

    //Load More Items Window Bottom Observer function
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !endOfData) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [setPage, loading, endOfData]);

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '10px',
            threshold: 1.0,
        });

        if (moviesData.length > 0) {
            observerRef.current.observe(document.getElementById('bottom_observerElement'));
        }

        return () => {

            if (observerRef.current) {

                observerRef.current.disconnect();
            }
        };
    }, [moviesData, handleObserver]);


    useEffect(() => {

        if (searchQuery !== '') {

            const getMovies = async () => {

                setLoading(true);

                setEndOfData(false);

                const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
                    apiPath: `${appConfig.backendUrl}/api/v1/movies/get/${searchQuery}`,
                    limitPerPage: 15,
                    page: page
                });

                if (page === 1) {

                    setMoviesData(filterResponse);

                } else {

                    setMoviesData((prevData) => [...prevData, ...filterResponse]);
                };

                if (dataIsEnd) {
                    setEndOfData(true);
                };

                setLoading(false);

            };

            getMovies();
        };

    }, [page, searchQuery]);

    return (
        <>

            <div className="sticky top-0 z-50 w-full h-auto border bg-white border-gray-100 shadow-md">

                <div className="w-full h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2 border">
                    <Link href="/" className="text-xl text-purple-800 text-ellipsis font-bold block mobile:hidden">Movies Bazzer</Link>
                    <input onChange={handleSearch} type="text" placeholder="Search movies web series and etc" className="border-2 border-purple-400 w-2/4 mobile:w-full h-10 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500" />
                </div>

                <CategoryGroupSlider />

            </div>

            <main className="min-h-screen bg-gray-100">

                {searchQuery !== "" && (

                   <MoviesCardsGirdWarper isLoading={loading} moviesData={moviesData} /> 
                )}

                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>

            </main>
        </>
    )
}

export default SearchPage;
