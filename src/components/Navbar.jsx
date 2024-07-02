'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "./CategoryGroupSlider";
import brandLogo from '../assets/images/brand_logo.png';

const WatchlaterModel = dynamic(() => import('./models/WatchlaterModel'), { ssr: false });

export default function Navbar() {

    // watch later model visibility handle state
    const [isVisible, setVisible] = useState(false);
    const [isModelLoaded, setModelLoaded] = useState(false);

    // show hide toggle watch later model
    const toggleWatchLaterModel = () => {

        setVisible((prevState) => !prevState);

        if (!isModelLoaded) {
            setModelLoaded(true)
        }
    };

    // hide watch later model
    const hideModel = () => {
        setVisible(false);
    }

    return (
        <>
            <header className="w-full h-auto">

                <nav className="w-auto h-auto bg-gray-900 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <Image
                            src={brandLogo}
                            className="mobile:hidden"
                            width={40}
                            height={40}
                        />
                        <Link href="/" className="font-semibold text-yellow-500 text-xl mobile:text-sm">
                            Movies Bazaar
                        </Link>
                    </div>

                    <div className="w-fit h-auto flex items-center gap-8 mobile:gap-3 mx-3">

                        <Link href="/search" title="Search bar" className="cursor-text mobile:hidden">
                            <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-sm py-1 bg-gray-800 text-gray-300 border-2 border-gray-700">
                                <i className="bi bi-search pl-3 text-base"></i>
                                <span>Search by title, cast, genre and more...</span>
                            </div>
                        </Link>

                        <Link aria-label="Search" title="Search" href="/search" className="hidden mobile:block p-0.5 mx-3">
                            <i className="bi bi-search text-gray-200 text-xl"></i>
                        </Link>

                        <div className="w-auto h-auto relative">
                            <button onClick={toggleWatchLaterModel} type="button" title="Watch later" className={`w-auto h-auto flex items-center px-2 py-1.5 hover:bg-gray-800 text-[13px] rounded-sm ${isVisible ? "text-yellow-500 bg-gray-800" : "text-gray-100"}`}>
                                <svg
                                    width="24"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    role="presentation"
                                >
                                    <path
                                        d="M17 3c1.05 0 1.918.82 1.994 1.851L19 5v16l-7-3-7 3V5c0-1.05.82-1.918 1.851-1.994L7 3h10zm-4 4h-2v3H8v2h3v3h2v-3h3v-2h-3V7z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span>Watch later</span>
                            </button>

                            {(isVisible || isModelLoaded) && (
                                <WatchlaterModel visibility={isVisible} functions={{ hideModel }} />
                            )}

                        </div>
                    </div>

                </nav>

            </header>

            <CategoryGroupSlider />

        </>
    )
};