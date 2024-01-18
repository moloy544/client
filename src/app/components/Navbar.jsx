'use client'

import Link from "next/link";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { useState } from "react";

export default function Navbar() {

    return (
        <>
            <header className="w-full h-auto bg-white">

                <nav className="w-auto h-auto bg-red-800 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between">
                    <Link href="/" className="font-semibold text-yellow-400 text-xl mobile:text-base">
                        Movies Bazaar
                    </Link>

                    <div className="w-fit h-auto flex items-center gap-8 mobile:gap-3 mx-3">

                        <Link href="/search" className="cursor-text mobile:hidden">
                            <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-base py-1 bg-gray-800 text-gray-300 border-2 border-gray-700">
                                <i className="bi bi-search pl-3 text-xl"></i>
                                <span>Search movies web series and more...</span>
                            </div>
                        </Link>

                        <Link href="/search" className="hidden mobile:block p-0.5 mx-3">
                            <i className="bi bi-search text-gray-200 text-xl"></i>
                        </Link>

                        <NotificationDropDown />

                    </div>

                </nav>

            </header>

            <CategoryGroupSlider />
        </>
    )
}

function NotificationDropDown() {

    const [isNotifactionVisible, setIsNotificationVisible] = useState(false);

    const toggleNotifaction = () => {
        setIsNotificationVisible((prevState) => !prevState)
    };

    const notifactionData = {
        news: [
            {
                id: 2822,
                nofifactionMessage: 'Add series option in our category now watch latest series free of cost',
                postDate: '2days ago 11:12PM'
            },
            {
                id: 8288,
                nofifactionMessage: 'New year 2024 movies and series is uploaded watch now latest movies series in 2024',
                postDate: ' 1days ago 08:23PM'
            }
        ]
    };

    return (
        <>

            < div className="w-auto h-auto relative">

                <div onClick={toggleNotifaction} role="button" className="p-1">
                    <i className="bi bi-bell-fill text-gray-100 text-2xl mobile:text-xl cursor-pointer hover:text-cyan-100"></i>
                </div>
                {isNotifactionVisible && (
                    <div className="w-auto h-auto bg-white rounded-md shadow-2xl absolute top-12 border border-gray-300 right-0 z-50">

                        <div className="border-b border-gray-900 text-gray-950 px-2 py-1.5 flex items-center gap-2">
                            <i onClick={toggleNotifaction} className="bi bi-arrow-left text-xl cursor-pointer"></i>
                            <span className="text-sm font-bold font-sans">Notifaction</span>
                        </div>

                        <div className="w-auto h-auto flex gap-2 px-2.5 py-2 justify-around border-b border-gray-300">
                            <div role="button" className="bg-gray-100 text-xs text-gray-700 border border-gray-400 rounded-xl px-3 py-1">
                                News
                            </div>
                            <div role="button" className="bg-gray-100 text-xs text-gray-700 border border-gray-400 rounded-xl px-3 py-1">
                                Message
                            </div>
                            <div role="button" className="bg-gray-100 text-xs text-gray-700 border border-gray-400 rounded-xl px-3 py-1">
                                Notice
                            </div>
                        </div>

                        <div className="w-64 h-80 overflow-y-scroll py-1 scrollbar-hidden">

                            {notifactionData.news?.map((data) => (
                                <div key={data.id} className="w-auto h-auto px-2 py-1.5 border-b border-gray-300 hover:bg-gray-100">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-gray-950 text-[12px] leading-[14px] line-clamp-3">
                                            {data.nofifactionMessage}
                                        </div>
                                        <span className="text-[10px] text-gray-500">
                                            {data.postDate}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

            </div >
        </>
    )
}
