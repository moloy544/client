'use client'

import Link from "next/link";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { useEffect, useState } from "react";

const NotificationModel = dynamic(() => import('./models/NotificationModel'), { ssr: false });

export default function Navbar() {

    return (
        <>
            <header className="w-full h-auto">

                <nav className="w-auto h-auto bg-gray-900 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between">

                    <Link href="/" className="font-semibold text-rose-500 text-xl mobile:text-base">
                        Movies Bazaar
                    </Link>

                    <div className="w-fit h-auto flex items-center gap-8 mobile:gap-3 mx-3">

                        <Link href="/search" className="cursor-text mobile:hidden">
                            <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-sm py-1 bg-gray-800 text-gray-300 border-2 border-gray-700">
                                <i className="bi bi-search pl-3 text-base"></i>
                                <span>Search movies web series and more...</span>
                            </div>
                        </Link>

                        <Link aria-label="Notification" href="/search" className="hidden mobile:block p-0.5 mx-3">
                            <i className="bi bi-search text-gray-200 text-xl"></i>
                        </Link>

                        <Notification />

                    </div>

                </nav>

            </header>

            <CategoryGroupSlider />

        </>
    )
}

function Notification() {

    const [isVisible, setVisible] = useState(false);

    const toggleNotifactionModel = () => {
        setVisible((prevState) => !prevState)
    };

    const handleScroll = () => {

        if (window.scrollY > 100 && isVisible) {
            setVisible(false);
        };
    };

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (

        <div className="w-auto h-auto relative">

            <div onClick={toggleNotifactionModel} role="button" className={`p-1 text-2xl mobile:text-xl cursor-pointer ${isVisible ? "text-rose-500" : "text-gray-100"}`}>
                <i className="bi bi-bell-fill"></i>
            </div>
            {isVisible && (
                <NotificationModel />
            )}

        </div>
    )
}
