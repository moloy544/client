'use client'

import { appConfig } from "@/config/config";
import { updateHomePageState } from "@/context/HomePageState/homePageSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SliderMoviesShowcase from "./components/SliderMoviesShowcase";

function HomePageLayout() {

    const homePageState = useSelector((state) => state.homePage);

    const {
        isAllLoad,
        secondSectionData,
        thirdSectionData,
        forthSectionData
    } = homePageState;

    const dispatch = useDispatch();

    const observerRef = useRef(null);

    const [offset, setOffset] = useState(1);
    const [loading, setLoading] = useState(false);

    const maxOffset = 4;

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && offset !== maxOffset) {
            setOffset((prevOffset) => prevOffset + 1);
        }
    };

    useEffect(() => {

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "50px",
            threshold: 1.0,
        });

        if (offset !== maxOffset && !loading) {
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

                if (offset === maxOffset) {
                    dispatch(updateHomePageState({ isAllLoad: true }));
                }
            }
        };

        if (!isAllLoad && offset !== 1) {
            getData();
        }

    }, [offset]);

    return (
        <>
            {secondSectionData && (
                <>
                    {secondSectionData?.sliderMovies?.map((data) => (
                        <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.movies} linkUrl={data.linkUrl} />

                    ))}
                </>
            )}

            {thirdSectionData && (
                <>

                    {thirdSectionData?.sliderMovies?.map((data) => (

                        <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.movies} linkUrl={data.linkUrl} />

                    ))}
                </>
            )}

            {forthSectionData && (
                <>

                    {forthSectionData?.sliderMovies?.map((data) => (

                        <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.movies} linkUrl={data.linkUrl} />

                    ))}
                </>
            )}

            {loading && (
                <div className=" w-full h-auto py-6 flex justify-center items-center">
                    <div className="text-cyan-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
