"use client"

import { useEffect, useRef } from 'react';

function BacktoTopButton({postion = 'top-20'}) {

    const prevScrollY = useRef(0);
    const backTopBtnRef = useRef(null);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleScroll = () => {

        const scrollY = window.scrollY;

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


    return (
        <button
            ref={backTopBtnRef}
            type="button"
            className={`bg-gray-950 bg-opacity-70 text-xs text-center text-gray-100 w-auto h-auto fixed ${postion} left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 px-2.5 py-1.5 rounded-2xl cursor-pointer hidden`}
            onClick={scrollTop}
        >
            <i className="bi bi-arrow-up-circle"></i> Back to top
        </button>
    );
}

export default BacktoTopButton;
