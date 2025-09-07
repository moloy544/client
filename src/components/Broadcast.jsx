"use client";

import { safeSessionStorage } from "@/utils/errorHandlers";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Broadcast() {
  const location = usePathname();
  const [broadcastMessage, setBroadcastMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const { isSocialjoinModalShow } = useSelector(
    (state) => state.fullWebAccessState
  );

  useEffect(() => {
    const notShowPaths = ["publisher", "dmca-admin"];
    const currentPath = location.split("/")[1];

    // Do not show on excluded paths or when modal is open
    if (notShowPaths.includes(currentPath) || isSocialjoinModalShow) return;

    const defaultBroadcastMsg = `👋 Welcome  
Some buffering may happen. We are fixing it and streaming will be smooth soon.  
🔧 If buffering is heavy, try 360p or 480p.  
Thanks for your patience ❤️`;

    let showTimer, hideTimer;

    const fetchMessage = async () => {
      try {
        const existingMsg = safeSessionStorage.get("broadcast_msg");
        if (existingMsg && existingMsg.length > 5) {
          setBroadcastMessage(existingMsg);
          return;
        }

        const res = await fetch("https://broadcast.mbazarstream.workers.dev");
        if (res.ok) {
          const data = await res.text();
          if (data && data.length > 5) {
            setBroadcastMessage(data);
            safeSessionStorage.set("broadcast_msg", data);
            return;
          }
        }

        setBroadcastMessage(defaultBroadcastMsg);
      } catch {
        setBroadcastMessage(defaultBroadcastMsg);
      }
    };

    // Fetch first (so message is ready), then show after delay
    fetchMessage();

    const showTimerDelay = isSocialjoinModalShow ? 70000 : 3000;
    showTimer = setTimeout(() => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 35000);
    }, showTimerDelay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isSocialjoinModalShow]);

  if (!visible || !broadcastMessage || broadcastMessage.trim().length < 5)
    return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none mx-2.5 mb-4">
      <div className="bg-white text-gray-900 px-3 py-2.5 rounded-2xl shadow-lg flex items-center space-x-4 pointer-events-auto max-w-xl animate-slideUp transform transition-all duration-300 hover:scale-105">
        <span className="flex-1 text-center font-semibold text-base mobile:text-sm whitespace-pre-line">
          {broadcastMessage}
        </span>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 w-8 h-8 rounded-full flex justify-center items-center text-gray-900 hover:text-gray-600 focus:outline-none font-bold bg-gray-300"
        >
          <i className="bi bi-x-lg text-base"></i>
          <span className="sr-only">Close</span>
        </button>
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