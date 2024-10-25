import { useCallback, useEffect, useRef } from "react";

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
};