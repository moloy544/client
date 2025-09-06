"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function BottomBroadcast() {

    const [show, setShow] = useState(false);
    const location = usePathname();
    const { isSocialjoinModalShow } = useSelector(
        (state) => state.fullWebAccessState
    );

    useEffect(() => {
        const notShowPaths = ["publisher", "dmca-admin"];
        const currentPath = location.split("/")[1];

        // If we are on excluded paths OR modal is currently open, do not show notice
        if (notShowPaths.includes(currentPath) || isSocialjoinModalShow) return;

        let hideTimer;
        const showTimerDelay = isSocialjoinModalShow ? 70000 : 3000;

        const showTimer = setTimeout(() => {
            setShow(true);

            hideTimer = setTimeout(() => {
                setShow(false);
            }, 30000); // stays visible for 25s
        }, showTimerDelay);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isSocialjoinModalShow]); // re-run if modal opens/closes

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none mx-2.5 mb-4">
            <div className="bg-white text-gray-900 px-3 py-2.5 rounded-2xl shadow-lg flex items-center space-x-4 pointer-events-auto max-w-xl animate-slideUp transform transition-all duration-300 hover:scale-105">
                <span className="flex-1 text-center font-semibold text-base mobile:text-sm">
                    👋 Welcome
                    You may see some buffering while streaming. We are fixing it and it will be smooth soon.
                </span>
                <button
                    onClick={() => setShow(false)}
                    className="ml-4 w-8 h-8 rounded-full justify-center items-center text-gray-900 hover:text-gray-600 focus:outline-none font-bold bg-gray-400"
                >
                    <i className="bi bi-x-lg text-base"></i>
                    <span className="sr-only">Close</span>
                </button>
            </div>

            <style jsx>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}