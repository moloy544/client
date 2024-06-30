'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatUrlLink } from "@/utils";
import { updateHomePageState } from "@/context/HomePageState/homePageSlice";
import { useDispatch, useSelector } from "react-redux";
import SliderShowcase from "@/components/SliderShowcase";
import FixedSearchIcon from "@/components/FixedSearchIcon";


function HomePageLayout({ initialLayoutData }) {

    const homePageState = useSelector((state) => state.homePage);

    const {
        isAllLoad,
        sectionTwo,
        sectionThree,
        sectionFour
    } = homePageState;

    const dispatch = useDispatch();

    const observerRefElement = useRef(null);

    const maxOffset = 4;
    const [offset, setOffset] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && offset !== maxOffset) {
            setOffset((prevOffset) => prevOffset + 1);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        });

        if (observerRefElement.current && !loading) {
            observer.observe(observerRefElement.current);
        };

        if (observerRefElement.current && offset === maxOffset) {
            observer.unobserve(observerRefElement.current);
        };

        return () => {
            if (observerRefElement.current) {
                observer.unobserve(observerRefElement.current);
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
            <FixedSearchIcon />
            
            {initialLayoutData && (
                <>

                    {initialLayoutData.sliderMovies?.map((data) => (

                        <SliderShowcase key={data.title} title={data.title} moviesData={data.moviesData} linkUrl={data.linkUrl} />
                    ))}

                    <SliderShowcase title="Bollywood hindi actress" linkUrl="/actress/bollywood">

                        {initialLayoutData.bollywoodActressData?.map((actor) => (

                            <Link
                                href={`/actress/${creatUrlLink(actor.name)}/${actor.imdbId?.replace('nm', '')}`}
                                key={actor.imdbId}
                                title={actor.name}
                                className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-pink-100 rounded-md">

                                <div className="w-24 h-24 mobile:w-20 mobile:h-20 rounded-full border-2 border-cyan-500">

                                    <Image
                                        className="w-full h-full object-fill pointer-events-none select-none rounded-full"
                                        src={actor.avatar}
                                        width={100}
                                        height={100}
                                        alt={actor.name}
                                    />
                                </div>

                                <div className="w-24 h-auto mobile:w-20 text-gray-900 overflow-hidden py-1.5">
                                    <p className="whitespace-normal text-xs font-semibold font-sans text-center leading-[14px]">
                                        {actor.name}
                                    </p>
                                </div>

                            </Link>
                        ))}
                    </SliderShowcase>
                </>
            )}
            {sectionTwo && (
                <>
                    {sectionTwo?.sliderMovies?.map((data) => (
                        <SliderShowcase
                            key={data.title}
                            title={data.title}
                            moviesData={data.movies}
                            linkUrl={data.linkUrl} />

                    ))}
                </>
            )}

            {sectionThree && (
                <>
                    {sectionThree?.sliderMovies?.map((data) => (

                        <SliderShowcase
                            key={data.title}
                            title={data.title}
                            moviesData={data.movies}
                            linkUrl={data.linkUrl} />
                    ))}
                </>
            )}

            {sectionFour && (
                <>
                    {sectionFour?.sliderMovies?.map((data) => (

                        <SliderShowcase
                            key={data.title}
                            title={data.title}
                            moviesData={data.movies}
                            linkUrl={data.linkUrl} />
                    ))}
                </>
            )}

            {loading && (
                <div className="w-full h-auto py-6 flex justify-center items-center">
                    <div className="text-cyan-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div>
                </div>
            )}

            <div className="w-full h-2" ref={observerRefElement}></div>
        </>
    )
}

export default HomePageLayout;
