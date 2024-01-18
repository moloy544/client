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
                            <div className="flex items-center gap-3 w-96 h-11 mobile:w-full mobile:h-9 rounded-[10px] text-sm py-1 bg-gray-800 text-gray-300 border-2 border-gray-700">
                                <i className="bi bi-search pl-3 text-base"></i>
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

    const notifactionTypesArray = ['news', 'message', 'notice'];

    const [isNotifactionVisible, setIsNotificationVisible] = useState(false);
    const [selectedNotifactionType, setSelectedNotifactionType] = useState('news');
    const [nofifactions, setNofifactions] = useState([
        {
            id: 2822,
            nofifaction: 'Add series option in our category now watch latest series free of cost',
            type: 'news',
            postDate: '2days ago 11:12PM'
        },
        {
            id: 8288,
            nofifaction: 'New year 2024 movies and series is uploaded watch now latest movies series in 2024',
            type: 'news',
            postDate: ' 1days ago 08:23PM'
        }
    ])

    const toggleNotifaction = () => {
        setIsNotificationVisible((prevState) => !prevState)
    };

    const filteredNotifactions = nofifactions?.filter((data) => data.type === selectedNotifactionType);

    return (

        <div className="w-auto h-auto relative">

            <div onClick={toggleNotifaction} role="button" className={`p-1 text-2xl mobile:text-xl cursor-pointer ${isNotifactionVisible? "text-yellow-400": "text-gray-100"}`}>
                <i className="bi bi-bell-fill"></i>
            </div>
            {isNotifactionVisible && (
                <div className="w-auto h-auto bg-white rounded-md shadow-2xl absolute top-12 border border-gray-400 right-0 z-50">

                    <div className="w-auto h-auto flex items-center gap-2 px-2 py-3 justify-around border-b border-gray-300">
                        {notifactionTypesArray.map((type, index) => (
                            <button key={index} onClick={() => setSelectedNotifactionType(type)} role="button"
                                className={`transition-all duration-200 ease-in-out text-xs border rounded-xl px-3 py-1 capitalize ${selectedNotifactionType == type ? "bg-blue-50 text-blue-600 border-blue-400" : "bg-gray-100 text-gray-700 border-gray-400"}`}>
                                {type}
                            </button>
                        ))}

                    </div>

                    <div className="w-72 h-96 overflow-y-scroll py-1 scrollbar-hidden">
                        {filteredNotifactions?.length > 0 ? (
                            <>
                                {filteredNotifactions?.map((data) => (
                                    <div key={data.id} className="w-auto h-auto px-2 py-1.5 border-b border-gray-300 hover:bg-gray-100">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-gray-950 text-[12px] leading-[14px] line-clamp-3">
                                                {data.nofifaction}
                                            </div>
                                            <span className="text-[10px] text-gray-500">
                                                {data.postDate}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </>

                        ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center">
                                     <div className="w-10 h-10 bg-blue-50 flex justify-center items-center rounded-full">
                                        <i class="bi bi-inbox text-xl text-blue-700"></i>
                                    </div>
                                    <div className="text-sm text-blue-900 text-center">No new {selectedNotifactionType} found</div>
                            </div>
                        )}
                    </div>

                </div>
            )}

        </div>
    )
}
