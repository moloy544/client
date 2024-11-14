'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "./CategoryGroupSlider";

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
            <header className="w-auto h-auto bg-gray-900 pt-2 px-2.5 mobile:px-2 flex items-center justify-between">
                <div className="flex items-center space-x-0.5">
                    <Image
                        src="https://res.cloudinary.com/dxhafwrgs/image/upload/v1720111766/moviesbazaar/brand_logo.png"
                        width={35}
                        height={35}
                        alt="Mobies bazar logo"
                        className="w-11 h-11 mobile:w-9 mobile:h-9"
                    />
                    <div className="flex flex-col mt-1">
                        <Link href="/" className="font-semibold text-yellow-500 text-xl mobile:text-[15px] leading-[14px]">
                            Movies Bazar
                        </Link>
                        <small className="text-yellow-500 mt-1 mobile:mt-0.5 text-xs mobile:text-[10px] font-medium pl-0.5">Made with love</small>
                    </div>
                </div>

                <div className="w-fit h-auto flex items-center gap-8 mobile:gap-3">

                    <Link href="/search" title="Search bar" className="cursor-text mobile:hidden">
                        <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-sm py-1 bg-custom-dark-bg text-gray-300 border-2 border-gray-700">
                            <i className="bi bi-search pl-3 text-base"></i>
                            <span>Search by title, cast, genre and more...</span>
                        </div>
                    </Link>

                    <Link aria-label="Search" title="Search" href="/search" className="hidden mobile:block p-0.5">
                        <i className="bi bi-search text-gray-200 text-xl"></i>
                    </Link>

                    <div className="w-auto h-auto relative">
                        <button onClick={toggleWatchLaterModel} type="button" title="Watch later" className={`w-auto h-auto flex items-center px-2 py-1.5 hover:bg-gray-800 text-[13px] rounded-sm ${isVisible ? "text-cyan-500 bg-gray-800" : "text-gray-100"}`}>
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

            </header>
            <CategoryGroupSlider />
        </>

    )
};