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
import BacktoTopButton from "@/components/BacktoTopButton";
import AdsterraAds from "@/components/ads/AdsterraAds";
import { adsConfig } from "@/config/ads.config";


function HomePageLayout({ initialLayoutData }) {

    const homePageState = useSelector((state) => state.homePage);

    const { isAllLoad, sliderMovies, sliderActors } = homePageState;

    const dispatch = useDispatch();

    const observerRefElement = useRef(null);

    const maxOffset = 4;
    const [offset, setOffset] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !isAllLoad) {
            setOffset((prevOffset) => prevOffset + 1);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        });

        if (observerRefElement.current && !loading && !isAllLoad) {
            observer.observe(observerRefElement.current);
        };

        return () => {
            if (observerRefElement.current) {
                observer.unobserve(observerRefElement.current);
            }
        };
    }, [offset, loading, isAllLoad]);

    useEffect(() => {

        const getData = async () => {

            try {

                setLoading(true);

                const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

                const response = await axios.post(apiUrl, { offset });

                if (response.status === 200) {

                    if (response.data.sliderMovies) {
                        dispatch(updateHomePageState({ sliderMovies: [...sliderMovies, ...response.data.sliderMovies] }))
                    };

                    if (response.data.sliderActors) {
                        dispatch(updateHomePageState({ sliderActors: [...sliderActors, ...response.data.sliderActors] }))
                    }
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

            <BacktoTopButton />

              {/**** For Load More Dinamic Dtaa *****/}
              <AdsterraAds nativeBannerAd={false} adOptions={adsConfig.adOptions2} />

            {/**** For Initail Static Data ******/}

            {initialLayoutData && initialLayoutData.sliderMovies?.map((data) => (

                <SliderShowcase key={data.title}
                    title={data.title}
                    moviesData={data.movies}
                    linkUrl={data.linkUrl}
                />
            ))}

            {sliderActors?.length > 0 && sliderActors.map((data, index) => (

                <SliderShowcase key={data.title || index} title={data.title} linkUrl={data.linkUrl}>

                    {data.actors?.map((actor) => (

                        <Link
                            href={`/actors/${creatUrlLink(actor.name)}/${actor.imdbId?.replace('nm', '')}`}
                            key={actor.imdbId}
                            title={actor.name}
                            className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-gray-700 rounded-md">

                            <div className="w-28 h-28 mobile:w-20 mobile:h-20 rounded-full border-2 border-yellow-600">

                                <Image
                                    className="w-full h-full object-fill select-none rounded-full"
                                    src={actor.avatar?.replace('/upload/', '/upload/w_250,h_250,c_scale/')}
                                    width={100}
                                    height={100}
                                    alt={actor.name}
                                />
                            </div>

                            <div className="w-auto h-auto mobile:w-20 text-gray-300 overflow-hidden py-1.5">
                                <p className="whitespace-normal text-xs font-semibold text-center leading-[15px] line-clamp-2 capitalize">
                                    {actor.name}
                                </p>
                            </div>

                        </Link>
                    ))}
                </SliderShowcase>
            ))}

            {sliderMovies?.length > 0 && sliderMovies?.map((data, index) => (
                <SliderShowcase
                    key={data.title || index}
                    title={data.title}
                    moviesData={data.movies}
                    linkUrl={data.linkUrl} />

            ))}

            {loading && (
                <div className="w-full h-auto mobile:py-6 py-10 flex justify-center items-center">
                    <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
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

function FixedSearchIcon() {

    const [searchIconVisibility, setSearchIconVisibility] = useState(false);

    const prevScrollY = useRef(0);

    const handleScroll = () => {

        const scrollY = window.scrollY;

        // For Search icon visibility
        setSearchIconVisibility(window.innerWidth <= 767 ? scrollY > 48 : scrollY > 72);

        prevScrollY.current = scrollY;
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!searchIconVisibility) {
        return null;
    };

    return (
        <div className="fixed right-14 bottom-16 mobile:bottom-10 mobile:right-8 w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-full z-20 flex items-center justify-center" style={{ boxShadow: 'rgb(212, 206, 7) 0px 0px 6px' }}>
            <Link aria-label="Search" title="Search" href="/search">
                <i className="bi bi-search md:text-2xl text-[20px] text-gray-900 font-bold"></i>
            </Link>
        </div>
    );
}
