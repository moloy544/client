'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function FixedSearchIcon() {

    const [isVisible, setIsVisible] = useState(false);

    const scrollTop = () => {

        if (isVisible) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',

            });
        }
    };

    const handleScroll = () => {

        if (window.innerWidth <= 767) {

            if (window.scrollY > 48) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                scrollTop();
            };

        } else {

            if (window.scrollY > 72) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                scrollTop();
            }
        };
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    if (!isVisible) {
        return null
    };

    return (
        <Link aria-label="Search" href="/search"
            style={{ boxShadow: 'rgb(212, 206, 7) 0px 0px 6px' }}
            className="fixed right-14 bottom-16 mobile:bottom-10 mobile:right-8 w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-full z-20 flex items-center justify-center">
            <i className="bi bi-search md:text-2xl text-[20px] text-gray-900 font-bold"></i>
        </Link>
    )
}

export default FixedSearchIcon
