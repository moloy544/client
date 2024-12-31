'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti'; // Importing the default export
import { motion } from 'framer-motion'; // Importing framer-motion for smooth animations
import { safeLocalStorage } from '@/utils/errorHandlers';

export default function NewYearCelebration() {

    const [showMessage, setShowMessage] = useState(false);

    // Fireworks effect
    const launchFireworks = () => {
        const duration = 10 * 1000; // 10 seconds
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 30,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 30,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    // Check if today is after January 10
    const isAfterJanuary10 = () => {
        const today = new Date();
        return today.getMonth() === 0 && today.getDate() >= 10; // Month is 0-based, so 0 = January
    };

    useEffect(() => {
        const storedNewYearData = safeLocalStorage.get('newYear_Wish');

        if (isAfterJanuary10()) {
            if (storedNewYearData) {
                // If it's January 10 or later, remove the key and return
                safeLocalStorage.remove('newYear_Wish');
            }
            return;
        }

        if (!storedNewYearData) {
            // If the key is not in local storage, show fireworks and the message
            launchFireworks();

            const messageTimer = setTimeout(() => {
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 10000); // Hide message after fireworks end (10 seconds)

                // Store that the user has seen the message
                safeLocalStorage.set('newYear_Wish', 'true');
            }, 500);

            return () => {
                clearTimeout(messageTimer);
            };
        }
    }, []);

    if (showMessage) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-gray-950 bg-opacity-10 z-[400]"
            >
                <div className="p-3 rounded-lg shadow-lg text-center bg-gray-950 bg-opacity-70 absolute top-1/3">
                    <div className="text-3xl font-bold text-gray-100 mobile:text-xl animate-bounce">
                        🎉 Happy New Year 2025! 🎉
                    </div>
                    <p className="mt-2 text-gray-200">
                        ✨ Watch the best movies and shows, all in one place! ✨
                    </p>
                </div>

            </motion.div>
        );
    }

    return null; // Don't render anything if message shouldn't be shown
}
