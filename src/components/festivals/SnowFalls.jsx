"use client"; // For Next.js, ensures this runs only on the client side

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import { useCurrentWindowSize } from '@/hooks/hook'; // Your custom hook to get window size

// Dynamically import the Snowfall component
const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });

export default function SnowFalls() {
    const [isLoaded, setIsLoaded] = useState(false); // Track if the site has fully loaded
    const windowWidth = useCurrentWindowSize().width; // Use your custom hook for window width

    // Determine the snowflake count based on window width
    const snowflakeCount = windowWidth < 768
        ? 40  // Fewer snowflakes for small screens
        : windowWidth > 1440
            ? 120 // More snowflakes for large screens
            : 100; // Default snowflake count for medium screens

    useEffect(() => {
        // Function to trigger after page is fully loaded
        const handleLoad = () => {
            setIsLoaded(true); // Set loaded state to true
        };

        // Check if the page has already fully loaded
        if (document.readyState === "complete") {
            // If the page is already loaded, trigger the handler
            handleLoad();
        } else {
            // Otherwise, add an event listener for window load
            window.addEventListener('load', handleLoad);
        }

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    // Return nothing if the site hasn't loaded yet
    if (!isLoaded) {
        return null;
    }

    return (
        <Snowfall
            color="white"
            snowflakeCount={snowflakeCount}
            speed={[0.5, 1.5]}
            wind={[0, 0.5]}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}
        />
    );
};