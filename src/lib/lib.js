'use client'

import { useCallback, useEffect, useRef } from "react";

// Prevent browser inspector custom component all children under this component is not use browser inspector
export function InspectPreventer({ children }) {

    useEffect(() => {
        const handleContextmenu = (event) => {
            if (process.env.NODE_ENV === 'production') {
                event.preventDefault(); // Prevent default right-click behavior  
            }
        };

        // Add event listener to the document body to prevent right-click
        document.body.addEventListener("contextmenu", handleContextmenu);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            document.body.removeEventListener("contextmenu", handleContextmenu);
        };
    }, []);

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
