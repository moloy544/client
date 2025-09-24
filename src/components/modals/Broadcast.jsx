"use client";

import { safeLocalStorage } from "@/utils/errorHandlers";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Broadcast() {
  const location = usePathname();
  const [visible, setVisible] = useState(false);
  const { isSocialjoinModalShow } = useSelector(
    (state) => state.fullWebAccessState
  );

  useEffect(() => {
    const notShowPaths = ["publisher", "dmca-admin"];
    const currentPath = location.split("/")[1];

    // Check if dismissed earlier
    const dismissed = safeLocalStorage.get("broadcastDismissed") ? JSON.parse(safeLocalStorage.get("broadcastDismissed")).video_server_down : null;
    
    if (dismissed) return;

    // Do not show on excluded paths or when modal is open
    if (notShowPaths.includes(currentPath) || isSocialjoinModalShow) return;

    let showTimer, hideTimer;
    const showTimerDelay = isSocialjoinModalShow ? 70000 : 3000;

    showTimer = setTimeout(() => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 60000);
    }, showTimerDelay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isSocialjoinModalShow]);

  const handleClose = () => setVisible(false);

  const handleNeverShowAgain = () => {
    safeLocalStorage.set("broadcastDismissed", JSON.stringify({
      video_server_down: true,
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
     <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none px-3 pb-4">
      <div className="bg-white text-gray-800 px-4 py-5 rounded-2xl shadow-lg w-full max-w-xl pointer-events-auto animate-slideUp transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center space-y-3 text-center">
          <strong className="text-lg mobile:text-base text-gray-900">
            📢 Video Server Downtime Notice
          </strong>

          <p className="font-medium text-base mobile:text-sm leading-relaxed">
            🔴 Some of our video servers are temporarily down.<br />
            We already working on fixing this issue and it will be resolved soon.<br />
            In the meantime, if available, please try watching from an alternate server.<br />
            Thank you for your patience ❤️
          </p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              onClick={handleClose}
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm mobile:text-xs font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Understand & Close
            </button>
            <button
              onClick={handleNeverShowAgain}
              className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm mobile:text-xs font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {"Already Read Do Not Show Again"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}