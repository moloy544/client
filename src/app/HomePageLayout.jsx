'use client'

import { appConfig } from "@/config/config";
import { updateHomePageState } from "@/context/HomePageState/homePageSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoviesCard from "./components/MoviesCard";
import Link from "next/link";

function HomePageLayout() {

    const homePageState = useSelector((state) => state.homePage);

    const { isAllLoad, secondSectionData, thirdSectionData } = homePageState;

    const dispatch = useDispatch();

    const observerRef = useRef(null);

    const [offset, setOffset] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && offset !== 3) {
            setOffset((prevOffset) => prevOffset + 1);
        }
    };

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "50px",
            threshold: 1.0,
        });

        if (offset !== 3 && !loading) {
            observerRef.current.observe(
                document.getElementById("bottom_observerElement")
            );
        };

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [offset, loading]);

    useEffect(() => {

        const getData = async () => {

            try {

                setLoading(true);

                const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

                const response = await axios.post(apiUrl, { offset });

                if (response.status === 200) {

                    const data = response.data

                    dispatch(updateHomePageState({ ...data }))
                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

                if (offset == 3) {
                    dispatch(updateHomePageState({ isAllLoad: true }));
                }
            }
        };

        if (!isAllLoad && offset !== 1) {
            getData();
        }

    }, [offset, isAllLoad]);

    return (
        <>
            {secondSectionData && (
                <>

                    {secondSectionData?.sliderMovies?.map((data) => (
                        <section key={data.title} className="w-full h-auto pt-2.5 mobile:pt-1">

                            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-2">
                                <h2 className="text-gray-200 text-xl mobile:text-sm font-semibold">{data.title}</h2>
                                <Link href={data.linkUrl} className="text-base mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
                            </div>

                            <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2 px-2">

                                <MoviesCard moviesData={data.movies} />

                            </div>

                        </section>
                    ))}
                </>

            )}

            {thirdSectionData && (
                <>

                    {thirdSectionData?.sliderMovies?.map((data) => (

                        <section key={data.title} className="w-full h-auto pt-2.5 mobile:pt-1">

                            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-2">
                                <h2 className="text-gray-200 text-xl mobile:text-sm font-semibold">{data.title}</h2>
                                <Link href={data.linkUrl} className="text-base mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
                            </div>

                            <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2 px-2">

                                <MoviesCard moviesData={data.movies} />

                            </div>

                        </section>
                    ))}
                </>
            )}

            {loading && (
                <div className=" w-full h-auto py-6 flex justify-center items-center">
                    <div className="text-white inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div>
                </div>
            )}


            <div id="bottom_observerElement" ref={observerRef}></div>
        </>
    )
}

export default HomePageLayout;
