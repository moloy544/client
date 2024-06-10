'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { creatUrlLink } from '@/utils';

export default function SliderShowcase({ title, moviesData, linkUrl, children }) {

    const sliderContainerRef = useRef(null);
    const leftButtonRef = useRef(null)
    const rightButtonRef = useRef(null)

    const handleSlide = (direction) => {
        const element = sliderContainerRef.current;
        if (direction === 'left') {
            element.scrollLeft -= window.innerWidth;
        } else if (direction === 'right') {
            element.scrollLeft += window.innerWidth;
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

    useEffect(() => {

        const element = sliderContainerRef.current;

        const handleScroll = () => {
            if (window.innerWidth > 767) {
                updateButtonsVisibility();
            }
        };

        element?.addEventListener('scroll', handleScroll);
        return () => {
            element?.removeEventListener('scroll', handleScroll);
        };
    }, []);


    if ((!moviesData || moviesData.length === 0) && !children) {
        return null;
    }

    return (
        <section className="w-full h-auto py-2 mobile:py-1.5 relative">
            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-3 mobile:pb-2">
                <div className="text-gray-100 text-[18px] mobile:text-sm font-medium line-clamp-1">{title}</div>
                {linkUrl && (
                    <Link href={linkUrl} className="text-[14px] mobile:text-[12px] text-cyan-500 hover:text-cyan-400 font-medium">
                        View All
                    </Link>
                )}
            </div>

            <div ref={sliderContainerRef} className="w-full h-auto flex flex-row overflow-x-scroll gap-2.5 mobile:gap-2 px-2 scrollbar-hidden relative scroll-smooth">
                {children ? children : (
                    <>
                        {moviesData?.map((data) => (
                            <div key={data.imdbId} className="movie_card text-xs mobile:text-[10px]">
                                <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`}>
                                    <div className="relative w-[160px] h-[200px] mobile:w-28 mobile:h-40 bg-white rounded-[3px] object-cover">
                                        <Image
                                            priority
                                            className="pointer-events-none select-none rounded-[3px]"
                                            src={data.thambnail}
                                            fill
                                            alt={data.title}
                                        />
                                    </div>
                                    <div className="movie_name_container">
                                        <span className="w-auto text-white font-sans line-clamp-3 leading-[13px]">{data.title}</span>
                                    </div>
                                    <div className="absolute top-0.5 right-0.5 w-auto h-auto px-1.5 py-0.5 bg-gray-950 bg-opacity-75 text-yellow-300 text-center font-sans font-semibold rounded-md">
                                        {data.releaseYear}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                )}

            </div>

            <button ref={leftButtonRef} onClick={() => handleSlide('left')} type="button" className="mobile:hidden w-11 h-11 bg-gray-950 bg-opacity-60 text-base text-white font-medium absolute top-2/4 left-2.5 -translate-y-2/4 rounded-full hidden">
                <i className="bi bi-chevron-left"></i>
            </button>

            <button ref={rightButtonRef} onClick={() => handleSlide('right')} type="button" className="mobile:hidden w-11 h-11 bg-gray-950 bg-opacity-60 text-base text-white font-medium absolute top-2/4 right-2.5 -translate-y-2/4 rounded-full">
                <i className="bi bi-chevron-right"></i>
            </button>

        </section>
    );
};
