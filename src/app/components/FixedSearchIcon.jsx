"use client"

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function FixedSearchIcon() {

    const [searchIconVisibility, setSearchIconVisibility] = useState(false);

    const prevScrollY = useRef(0);
    const backTopBtnRef = useRef(null);

    const scrollTop = () => {
        if (searchIconVisibility) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleScroll = () => {
        
        const scrollY = window.scrollY;

        // For Search icon visibility
        setSearchIconVisibility(window.innerWidth <= 767 ? scrollY > 48 : scrollY > 72);

        // For Back to top button visibility
        if (scrollY >= 250 && scrollY <= prevScrollY.current) {
            backTopBtnRef.current?.classList.add('block');
            backTopBtnRef.current?.classList.remove('hidden');
        } else {
            backTopBtnRef.current?.classList.add('hidden');
            backTopBtnRef.current?.classList.remove('block');
        }

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
            {searchIconVisibility && (
                <Link aria-label="Search" href="/search" className="fixed right-14 bottom-16 mobile:bottom-10 mobile:right-8 w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-full z-20 flex items-center justify-center" style={{ boxShadow: 'rgb(212, 206, 7) 0px 0px 6px' }}>
                    <i className="bi bi-search md:text-2xl text-[20px] text-gray-900 font-bold"></i>
                </Link>
            )}
            <button
                ref={backTopBtnRef}
                type="button"
                className="bg-gray-950 bg-opacity-70 text-xs text-center text-gray-100 w-auto h-auto fixed top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 px-2.5 py-1.5 rounded-2xl cursor-pointer hidden"
                onClick={scrollTop}
            >
                <i className="bi bi-arrow-up-circle"></i> Back to top
            </button>
        </>
    );
}

export default FixedSearchIcon;
