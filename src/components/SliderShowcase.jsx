'use client';

import { useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { creatUrlLink } from '@/utils';

const SliderShowcase = memo(({ title, moviesData, space, linkUrl, children }) => {

    const sliderContainerRef = useRef(null);
    const movieCardRef = useRef(null);
    const leftButtonRef = useRef(null)
    const rightButtonRef = useRef(null)

    const handleSlide = (direction) => {
        const element = sliderContainerRef.current;
        const scroll_amount = sliderContainerRef.current.clientWidth / 1.5;
        if (direction === 'left') {
            element.scrollLeft -= scroll_amount;
        } else if (direction === 'right') {
            element.scrollLeft += scroll_amount;
        }
    };

    const updateButtonsVisibility = () => {

        const element = sliderContainerRef.current;
        const leftButton = leftButtonRef.current;
        const rightButton = rightButtonRef.current;

        if (element.scrollLeft > 100) {
            leftButton.style.display = 'block';
        } else {
            leftButton.style.display = 'none';
        }
        if (element.scrollLeft < element.scrollWidth - element.clientWidth) {
            rightButton.style.display = 'block';
        } else {
            rightButton.style.display = 'none';
        }
    };

    const handleObservers = (entries) => {

        const rightButton = rightButtonRef.current;
        const lastTarget = entries[entries.length - 1];

        if (rightButton && lastTarget.isIntersecting) {
            rightButton.style.display = 'none';
        };
    };

    useEffect(() => {

        const element = sliderContainerRef.current;

        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: "10px",
            threshold: 1.0,
        });

        if (movieCardRef.current) {
            observer.observe(movieCardRef.current);
        };

        const handleScroll = () => {
            if (window.innerWidth > 767) {
                updateButtonsVisibility();
            }
        };

        element?.addEventListener('scroll', handleScroll);

        return () => {
            if (movieCardRef.current) {
                observer.unobserve(movieCardRef.current);
            };
            element?.removeEventListener('scroll', handleScroll);
        };
    }, [handleObservers]);


    if ((!moviesData || moviesData.length === 0) && !children) {
        return null;
    }

    return (
        <section className="w-full h-auto relative space-y-2 py-1.5">
            <div className="w-full h-auto flex justify-between items-center px-2.5">
                <h2 className="text-gray-200 text-[18px] mobile:text-sm font-medium line-clamp-1">
                    {title}
                </h2>
                {linkUrl && (
                    <Link href={linkUrl} className="text-[13px] mobile:text-[12px] text-gray-200 hover:text-cyan-400 font-medium">
                        <span>View All</span>
                        <i className="bi bi-chevron-right"></i>
                    </Link>
                )}
            </div>

            <div ref={sliderContainerRef} className={`w-full h-auto flex flex-row overflow-x-scroll ${!space ? 'space-x-2 mobile:space-x-1.5' : space} px-2 scrollbar-hidden relative scroll-smooth`}>
                {children ? children : (
                    <>
                        {moviesData?.map((data) => (
                            <div ref={movieCardRef} key={data.imdbId} className="movie_card text-xs mobile:text-[10px]">
                                <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} title={data.title + ' ' + data.releaseYear + ' ' + data.type} prefetch={false}>
                                    <div className="relative w-[155px] h-[210px] mobile:w-28 mobile:h-40 bg-white rounded-[3px]">
                                        <Image
                                            priority
                                            className="select-none rounded-[3px]"
                                            src={data.thambnail?.replace('/upload/', '/upload/w_500,h_700,c_scale/')}
                                            fill
                                            alt={data.title}
                                        />
                                    </div>
                                    <div className="movie_name_container">
                                        <span className="w-auto text-white font-sans line-clamp-3 mobile:text-[10px] text-xs leading-[14px] px-2 py-1">{data.title}</span>
                                    </div>

                                    <div className="absolute top-0.5 left-0.5 w-auto h-auto px-1.5 py-0.5 bg-gray-950 bg-opacity-75 text-yellow-400 text-center font-sans font-semibold rounded-md">
                                        {data.releaseYear}
                                    </div>

                                </Link>
                            </div>
                        ))}
                    </>
                )}

            </div>

            <button
                ref={leftButtonRef}
                onClick={() => handleSlide('left')}
                type="button"
                title="Slide right"
                className="w-11 h-11 mobile:hidden bg-gray-950 bg-opacity-60 text-base text-white font-medium absolute top-2/4 left-2 -translate-y-2/4 rounded-full hidden">
                <span className="sr-only">Slide left button</span>
                <div className="flex justify-center items-center">
                    <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="presentation"
                    >
                        <path d="M18.378 23.369c.398-.402.622-.947.622-1.516 0-.568-.224-1.113-.622-1.515l-8.249-8.34 8.25-8.34a2.16 2.16 0 0 0 .548-2.07A2.132 2.132 0 0 0 17.428.073a2.104 2.104 0 0 0-2.048.555l-9.758 9.866A2.153 2.153 0 0 0 5 12.009c0 .568.224 1.114.622 1.515l9.758 9.866c.808.817 2.17.817 2.998-.021z"></path>
                    </svg>

                </div>
            </button>

            <button
                ref={rightButtonRef}
                onClick={() => handleSlide('right')}
                type="button" title="Slide left"
                className="w-11 h-11 mobile:hidden bg-gray-950 bg-opacity-60 text-base text-white font-medium absolute top-2/4 right-2 -translate-y-2/4 rounded-full">
                <span className="sr-only">Slide right button</span>
                <div className="flex justify-center items-center">
                    <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="presentation"
                    >
                        <path d="M5.622.631A2.153 2.153 0 0 0 5 2.147c0 .568.224 1.113.622 1.515l8.249 8.34-8.25 8.34a2.16 2.16 0 0 0-.548 2.07c.196.74.768 1.317 1.499 1.515a2.104 2.104 0 0 0 2.048-.555l9.758-9.866a2.153 2.153 0 0 0 0-3.03L8.62.61C7.812-.207 6.45-.207 5.622.63z"></path>
                    </svg>
                </div>
            </button>

        </section>
    );
});

SliderShowcase.displayName = 'SliderShowcase';
export default SliderShowcase;