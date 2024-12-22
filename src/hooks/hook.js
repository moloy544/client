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

const useCurrentWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        const handleResize = () => {
            if (window !== 'undefined') {
                setWindowWidth({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
            
        };

        // Set initial value on mount
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth;
};

export {
    useOrientation,
    useCurrentWindowSize
}