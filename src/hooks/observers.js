import { useCallback, useEffect, useRef, useState } from "react";

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

// Custom hook for provide element visibility status by observing element
export function useObserveElement() {

    const observerElement = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleObservers = useCallback((entries) => {
        const target = entries[0];
        setIsVisible(target.isIntersecting);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: '20px',
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

