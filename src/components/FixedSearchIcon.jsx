"use client"

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BacktoTopButton from './BacktoTopButton';

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
        <>
            <Link aria-label="Search" href="/search" className="fixed right-14 bottom-16 mobile:bottom-10 mobile:right-8 w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-full z-20 flex items-center justify-center" style={{ boxShadow: 'rgb(212, 206, 7) 0px 0px 6px' }}>
                <i className="bi bi-search md:text-2xl text-[20px] text-gray-900 font-bold"></i>
            </Link>
            <BacktoTopButton />
        </>
    );
}

export default FixedSearchIcon;
