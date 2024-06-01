'use client'

import Link from "next/link";
import dynamic from "next/dynamic";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { useState } from "react";

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

                    <Link href="/" className="font-semibold text-rose-500 text-xl mobile:text-base">
                        Movies Bazaar
                    </Link>

                    <div className="w-fit h-auto flex items-center gap-8 mobile:gap-3 mx-3">

                        <Link href="/search" className="cursor-text mobile:hidden">
                            <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-sm py-1 bg-gray-800 text-gray-300 border-2 border-gray-700">
                                <i className="bi bi-search pl-3 text-base"></i>
                                <span>Search by title, cast, genre and more...</span>
                            </div>
                        </Link>

                        <Link aria-label="Notification" href="/search" className="hidden mobile:block p-0.5 mx-3">
                            <i className="bi bi-search text-gray-200 text-xl"></i>
                        </Link>

                        <div className="w-auto h-auto relative">
                            <button onClick={toggleWatchLaterModel} type="button" className={`p-1 text-2xl mobile:text-xl cursor-pointer ${isVisible ? "text-yellow-500" : "text-gray-100"}`}>
                                <i className="bi bi-clock"></i>
                                <span className="sr-only">Watch later</span>
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
