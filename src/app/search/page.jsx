'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import Link from "next/link";
import { appConfig } from "@/config/config";
import { fetchMoviesFromServer } from "../../utils";

const MoviesCard = dynamic(() => import('../components/MoviesCard'), { ssr: false })

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

        }, 1500);

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
            <div className="sticky top-0 left-0 z-50 w-full h-auto bg-white">

                <div className="w-full bg-red-800 mobile:bg-transparent h-auto flex justify-between items-center py-4 px-5 mobile:py-3 mobile:px-2 border">
                    <Link href="/" className="text-xl text-yellow-300 text-ellipsis font-bold block mobile:hidden">Movies Bazaar</Link>
                    <input onChange={handleSearch} type="text" placeholder="Search movies web series and etc" className="border-2 border-red-800 w-[45%] mobile:w-full mobile:h-10 h-11 rounded-md px-2 text-base mobile:text-sm placeholder:text-gray-500 shadow-2xl" autoFocus />
                </div>

                <CategoryGroupSlider />
                
            </div>

            <main className="w-full h-auto bg-cyan-50 my-3 mobile:my-2 overflow-x-hidden">
            <div className="w-full h-auto mobile:my-1 px-2 gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] overflow-x-hidden">

                    {searchQuery !== "" && (<MoviesCard isLoading={loading} moviesData={moviesData} />)}
                    
                </div>
                {/* Intersection Observer target */}
                <div ref={observerRef} id="bottom_observerElement"></div>
            </main>
        </>
    )
}

export default SearchPage;
