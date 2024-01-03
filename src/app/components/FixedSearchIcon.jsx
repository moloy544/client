'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function FixedSearchIcon() {

    const [isVisible, setIsVisible] = useState(false);

    const scrollTop =()=>{

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

    return (
        <Link href="/search" style={{boxShadow: 'rgb(212, 206, 7) 0px 0px 6px'}} className={`fixed right-14 bottom-16 mobile:bottom-10 mobile:right-8 w-11 h-11 bg-yellow-500 rounded-full z-20 flex items-center justify-center ${isVisible ? 'block' : 'hidden'}`}>
            <i className="bi bi-search text-xl mobile:text-[18px] text-gray-900 font-bold"></i>
        </Link>
    )
}

export default FixedSearchIcon
