import Link from "next/link";
import bokmyshowIcon from "../../assets/icons/bookmyshow-small-icon.jpg";
import paytmIcon from "../../assets/icons/paytm-small-icon.png";
import Image from "next/image";

export default function RestrictedModal({ onClose, contentTitle, contentType, isInTheater, ticketBookLink }) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center relative mx-2.5 py-2">
                <div className="text-xl w-full md:text-2xl font-bold text-gray-800 mb-4 text-center px-4 py-2 relative">
                    <div>Content Unavailable</div>
                    <button
                        onClick={onClose}
                        className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-2 right-3"
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg text-base"></i>
                    </button>

                </div>

                <div className="p-3">
                    <div className="text-sm md:text-base text-gray-800 mb-3 font-semibold">
                        We follow copyright laws and respect all content creators and rights holders.
                    </div>

                    <div className="text-sm md:text-base text-gray-700 mb-3 font-medium">
                        <div className="text-sm md:text-base text-gray-700 mb-3">
                            This {contentType} is not available because it is currently running in theatres, or access has been disabled at the request of the rightful owner.
                        </div>
                    </div>
                    {isInTheater && (
                        <>
                            <div className="text-sm md:text-base text-gray-700 mb-5 font-semibold">
                                No worries! 🎉 You can still enjoy <span className="text-red-600">{contentTitle}</span> {contentType || ""} at your nearest cinema.
                                Book your tickets now and experience it on the big screen! 🍿
                            </div>
                            <div className="font-bold text-base my-3">Get Your Tickets 🎟️</div>
                            {/* Flex container for booking sites */}
                            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">

                                {/* BookMyShow */}
                                <a href={ticketBookLink ? ticketBookLink : "https://in.bookmyshow.com"} target="_blank" rel="noopener noreferrer nofollow"
                                    className="flex items-center gap-2 px-2 py-2.5 border rounded-lg hover:bg-gray-100 transition">
                                    <Image width={25} h={25} src={bokmyshowIcon} className="rounded-lg" alt="BookMyShow Logo" />
                                    <span className="text-gray-800 font-semibold text-xs">BookMyShow</span>
                                </a>

                                {/* Paytm Movies */}
                                <a href="https://paytm.com/movies" target="_blank" rel="noopener noreferrer nofollow"
                                    className="flex items-center gap-2 px-2 py-2.5 border rounded-lg hover:bg-gray-100 transition">
                                    <Image width={25} h={25} src={paytmIcon} className="rounded-lg" alt="Paytm movies logo" />
                                    <span className="text-gray-800 font-semibold text-xs">Paytm Movies</span>
                                </a>

                            </div>
                        </>
                    )}
                    <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                        🔎 Explore More Available Content
                    </Link>

                    <div className="text-xs text-gray-600 mt-3">
                        Thank you for supporting creativity and respecting copyright laws.
                    </div>
                </div>
            </div>
        </div>
    );
}
