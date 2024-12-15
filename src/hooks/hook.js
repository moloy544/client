"use client"

import { useEffect, useState } from 'react';

const useOrientation = () => {
    const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);

    useEffect(() => {
        const handleOrientationChange = (e) => {
            setIsPortrait(e.matches);
        };

        const mediaQueryList = window.matchMedia('(orientation: portrait)');
        mediaQueryList.addEventListener('change', handleOrientationChange);

        return () => {
            mediaQueryList.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    return isPortrait;
};

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(undefined);

    useEffect(() => {
        // Check if window is defined (i.e., the code is running on the client-side)
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            // Set initial value
            handleResize();

            // Add event listener for window resize
            window.addEventListener('resize', handleResize);

            // Cleanup event listener on component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return windowWidth;
};

export {
    useOrientation,
    useWindowWidth
}