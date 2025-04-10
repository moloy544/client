"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appConfig } from "@/config/config";
import { useDispatch } from "react-redux";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";

export default function TopSlideNotice() {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const { isRestricted } = useSelector((state) => state.fullWebAccessState);

    useEffect(() => {
        const controller = new AbortController();

        const fetchGeoInfo = async () => {
            try {
                const response = await fetch(`${appConfig.backendUrl}/api/v1/user/get_geo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ test: 'data' }),
                    signal: controller.signal,
                });

                const data = await response.json();
                const { isRestricted } = data || {};

                // Update global state
                dispatch(updatefullWebAccessState({ isRestricted }));

                if (isRestricted) {
                    setTimeout(() => setShow(true), 5000); // 5 sec delay
                }

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Geo check failed:", error);
                }
            }
        };

        fetchGeoInfo();

        return () => controller.abort();
    }, [dispatch]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-0 left-0 w-full z-[500] bg-yellow-300 text-yellow-900 shadow-lg py-4 px-6 flex items-center justify-center"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="text-center max-w-3xl">
                        <p className="text-sm md:text-base font-semibold leading-relaxed">
                            We follow Indian CMCA rules to respect content ownership and copyrights.
                            In a few days, users in India may not be able to access certain movies and shows,
                            as per the guidelines of content owners. Thank you for your understanding and support.
                        </p>
                        <button
                            onClick={() => setShow(false)}
                            className="mt-3 outline-none border border-yellow-400 font-semibold shadow-md bg-yellow-200 text-yellow-900 px-4 py-1.5 rounded hover:bg-yellow-400 transition-all duration-300"
                        >
                            Okay, I understand
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
