import { useEffect, useRef, useState } from 'react';

const useBottomObserver = ({ target = null, root = null, rootMargin = "10px", threshold = 1.0 }) => {
    const [isBottomVisible, setIsBottomVisible] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            setIsBottomVisible(entry.isIntersecting);
        }, { root, rootMargin, threshold });

        if (target) {
            observerRef.current.observe(target);
        }

        return () => {
            if (target) {
                observerRef.current.unobserve(target);
            }
        };
    }, [target, root, rootMargin, threshold]);

    return isBottomVisible;
};

export { useBottomObserver };
