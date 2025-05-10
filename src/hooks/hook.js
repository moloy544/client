"use client"

import { usePathname } from 'next/navigation';
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
// Detect browser devtool open 
const useDetectDevTools = () => {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

    useEffect(() => {
        const threshold = 100; // Fallback for window size checks

        const detectDevTools = () => {
            // Calculate window size difference as a fallback
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            // Fallback size detection
            const isSizeDifference = widthDiff > threshold || heightDiff > threshold;

            // Measure code execution time to detect if DevTools is open
            const start = performance.now();
            console.log(""); // Perform a lightweight action
            const end = performance.now();

            // Check if the time taken exceeds a reasonable threshold (DevTools affects timing)
            const isDevToolsTimingDetected = end - start > 100;

            // Update state based on either timing or size difference
            setIsDevToolsOpen(isDevToolsTimingDetected || isSizeDifference);

            // If DevTools is detected
            if (isDevToolsTimingDetected) {
                console.warn("Developer tools detected (timing-based detection)!");
            }
        };

        detectDevTools();

        // Detect changes on resize
        window.addEventListener('resize', detectDevTools);

        return () => {
            window.removeEventListener('resize', detectDevTools);
        };
    }, []);

    return isDevToolsOpen;
};

const useHandleModalsVisiblityByQueryParams = () => {

    const pathname = usePathname();

    const handleModalVisibility = ({modalId, open=false, close=true}) => {
        // Check if the window object is available (for SSR compatibility)
        if (typeof window === 'undefined') return;

        // Create a new URLSearchParams object from the current URL's query string
        const params = new URLSearchParams(window.location.search);

        // If the term is provided, set the 'query' param, otherwise remove it
        if (open) {
            params.set('modal', modalId);
        } else if (close) {
            params.delete('modal');
        }

        // Use history.pushState() to update the URL without reloading the page
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);

    };
    return handleModalVisibility;
};

export {
    useOrientation,
    useCurrentWindowSize,
    useDetectDevTools,
    useHandleModalsVisiblityByQueryParams
}