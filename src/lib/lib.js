'use client'

import { useCallback, useEffect, useState, useRef } from "react";

// Prevent browser inspector custom component all children under this component is not use browser inspector
export function InspectPreventer({ children, forceToPrevent = true }) {

    useEffect(() => {
        const handleContextmenu = (event) => {
            if (process.env.NODE_ENV === 'production') {
                if (forceToPrevent) {
                    event.preventDefault(); // Prevent default right-click behavior  
                }
            }
        };

        // Add event listener to the document body to prevent right-click
        document.body.addEventListener("contextmenu", handleContextmenu);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            document.body.removeEventListener("contextmenu", handleContextmenu);
        };
    }, [forceToPrevent]);

    return children
};

// Custom hook for infinite scrolling
export function useInfiniteScroll({ callback, loading, isAllDataLoad, rootMargin }) {
    const observerElement = useRef(null);

    const handleObservers = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !isAllDataLoad) {
            callback();
        }
    }, [loading, isAllDataLoad, callback]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: rootMargin || "50px",
            threshold: 1.0,
        });

        if (observerElement.current) {
            observer.observe(observerElement.current);
        }

        return () => {
            if (observerElement.current) {
                observer.unobserve(observerElement.current);
            }
        };
    }, [handleObservers]);

    return observerElement;
}


const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(true); // Default to true assuming server-side rendering

    useEffect(() => {
        // Check if window and navigator are available (which means we're on the client side)
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            setIsOnline(navigator.onLine);

            const handleOnline = () => setIsOnline(true);
            const handleOffline = () => setIsOnline(false);

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            // Clean up the event listeners when the component unmounts
            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }
    }, []);

    return isOnline;
};

export default useOnlineStatus;
