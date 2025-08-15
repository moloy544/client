'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { useCurrentWindowSize } from '@/hooks/hook';

export default function IndependenceDayCelebration() {
    const [showMessage, setShowMessage] = useState(false);

    const { width } = useCurrentWindowSize();

    // Subtle Fireworks effect (Indian flag colors)
    const launchFireworks = () => {
        const duration = 8 * 1000; // 5 seconds
        const end = Date.now() + duration;
        const colors = ['#FF9933', '#FFFFFF', '#138808'];

        (function frame() {
            confetti({
                particleCount: width < 700 ? 4 : 5, // lower number of particles
                angle: 60,
                spread: width < 700 ? 15 : 40,       // tighter spread
                origin: { x: 0 },
                colors
            });
            confetti({
                particleCount: width < 700 ? 4 : 5, // lower number of particles
                angle: 120,
                spread: width < 700 ? 15 : 40,       // tighter spread
                origin: { x: 1 },
                colors
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    };

    // Show between Aug 14 00:00 and Aug 16 10:00 UTC
    const isCelebrationTime = () => {
        const now = new Date();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        const utcHour = now.getUTCHours();

        if (utcMonth === 7) { // August (0-based)
            if (utcDate === 14) return true;
            if (utcDate === 15) return true;
            if (utcDate === 16 && utcHour < 10) return true;
        }
        return false;
    };

    useEffect(() => {
        const stored = safeLocalStorage.get('independence_day_wish');

        if (!isCelebrationTime()) {
            if (stored) safeLocalStorage.remove('independence_day_wish');
            return;
        }

        if (!stored && width) {
            setTimeout(() => {
                launchFireworks();
            }, 1200);

            setShowMessage(true);
            safeLocalStorage.set('independence_day_wish', 'true');

            setTimeout(() => {
                setShowMessage(false);
            }, 12000);
        }
    }, [width]);


    if (!showMessage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-[999999]"
        >
            <div className="bg-white/50 backdrop-blur-md text-gray-900 px-6 py-4 rounded-xl shadow-lg text-center max-w-sm pointer-events-auto">
                <img
                    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                    alt="Indian Flag"
                    className="w-12 h-auto mx-auto mb-2 rounded shadow-sm"
                />
                <p className="text-xl mobile:text-base font-extrabold mb-1 text-gray-100">
                    🎉 Happ Independence Day 🎉
                </p>
                <p className="text-sm text-gray-200 font-semibold">Celebrate freedom and unity! 🇮🇳</p>
            </div>

        </motion.div>
    );
}