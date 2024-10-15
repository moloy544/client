'use client';

import { useRef, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { creatUrlLink, resizeImage } from '@/utils';

const SliderShowcase = ({ title, moviesData, space, linkUrl, imageResize = false, thambnailImagePriority = false, children }) => {

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

    const handleObservers = useCallback((entries) => {

        const rightButton = rightButtonRef.current;
        const lastTarget = entries[entries.length - 1];

        if (rightButton && lastTarget.isIntersecting) {
            rightButton.style.display = 'none';
        };
    }, []);

    useEffect(() => {

        const element = sliderContainerRef.current;
        const movieCard = movieCardRef.current;

        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: "10px",
            threshold: 1.0,
        });

        if (movieCard) {
            observer.observe(movieCard);
        };

        const handleScroll = () => {
            if (window.innerWidth > 767) {
                updateButtonsVisibility();
            }
        };

        element?.addEventListener('scroll', handleScroll);

        return () => {
            if (movieCard) {
                observer.unobserve(movieCard);
            };
            element?.removeEventListener('scroll', handleScroll);
        };
    }, [handleObservers]);


    if (!children && (!moviesData || !Array.isArray(moviesData) || moviesData.length === 0)) {
        return null;
    };

    return (
        <section className="w-full h-auto relative space-y-2.5 py-1.5">
            <div className="w-full h-auto flex justify-between items-center px-2.5">
                <div className="flex items-center border-l-[3px] rounded-sm border-yellow-500 pl-1">
                    <h2 className="text-gray-200 text-[18px] mobile:text-sm font-semibold line-clamp-1">
                        {title}
                    </h2>
                </div>
                {linkUrl && (
                    <Link href={linkUrl} className="text-[13px] mobile:text-[12px] text-gray-200 hover:text-cyan-400 font-medium" prefetch={false}>
                        <span>View All</span>
                        <i className="bi bi-chevron-right"></i>
                    </Link>
                )}
            </div>

            <div
                ref={sliderContainerRef}
                className={`w-full h-auto flex flex-row overflow-x-scroll ${!space ? 'space-x-2 mobile:space-x-1.5' : space} px-2 scrollbar-hidden relative scroll-smooth`}
            >
                {children ? children : (
                    <>
                        {moviesData?.map((data) => (
                            <div
                                ref={movieCardRef}
                                key={data.imdbId}
                                className="movie_card max-h-64 text-xs mobile:text-[10px] flex-shrink-0"
                                style={{ width: 'calc(100% / 6)', maxWidth: '180px', minWidth: '110px', }}
                            >
                                <Link
                                    href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`}
                                    title={`${data.title} ${data.releaseYear} ${data.type}`}
                                    prefetch={false}
                                >
                                    <div className="relative w-full aspect-[2/3] h-full bg-white rounded-[3px]">
                                        <Image
                                            priority={thambnailImagePriority}
                                            fill
                                            className="select-none rounded-[3px] object-fill"
                                            src={resizeImage(data.thambnail, imageResize)}
                                            alt={data.title}
                                            blurDataURL={resizeImage(data.thambnail)}
                                            placeholder="blur"
                                        />
                                    </div>
                                    <div className="movie_name_container">
                                        <span className="w-auto text-white font-sans line-clamp-3 mobile:text-[10px] text-xs leading-[14px] px-2 mobile:py-1.5 py-2">{data.title}</span>
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
}
export default SliderShowcase;