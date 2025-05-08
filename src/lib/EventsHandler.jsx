"use client";

import { useCurrentWindowSize } from "@/hooks/hook";
import { cloneElement, useEffect, useRef, useState, Children } from "react";

export const ModelsController = ({
    children,
    visibility,
    closeEvent,
    transformEffect = false,
    windowScroll = true
}) => {

    if (Children.count(children) !== 1) {
        throw new Error("ModelsController expects exactly one child element.");
    };

    const windowCurrentWidth = useCurrentWindowSize().width;

    const isTransformEffect = (transformEffect && typeof transformEffect === "boolean" && windowCurrentWidth <= 450) ? true : false;

    const initialStyle = {
        transition: isTransformEffect ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.5s ease',
        opacity: 0,
    };

    const elementRef = useRef(null);
    const [styleObj, setStyleObj] = useState(initialStyle);

   
    // Intersection Observer to auto-close modal if less than 50% visible
    useEffect(() => {
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio < 0.5 && visibility && (closeEvent && typeof closeEvent === "function")) {
                    closeEvent();
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: [0.5]
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [visibility, closeEvent]);

    useEffect(() => {
        const outsideClickHandler = ({ target }) => {
            if (!elementRef.current) return;
            if (!visibility || elementRef.current.contains(target) || !closeEvent) return;
            closeEvent();
        };

        const rightClickHandler = (event) => {
            if (!elementRef.current) return;
            if (!visibility || elementRef.current.contains(event.target) || !closeEvent) return;
            event.preventDefault();
            closeEvent();
        };

        document.addEventListener('click', outsideClickHandler);
        document.addEventListener('contextmenu', rightClickHandler);

        return () => {
            document.removeEventListener('click', outsideClickHandler);
            document.removeEventListener('contextmenu', rightClickHandler);
        };
    }, [visibility, closeEvent]);

    useEffect(() => {
        const body = document.querySelector('body');

        if (visibility) {
            setStyleObj(prevStyle => ({
                ...prevStyle,
                opacity: 1,
                transform: isTransformEffect ? 'translateY(0)' : undefined,
            }));
            if (windowScroll === false && !body.classList.contains('scrollbar-hidden')) {
                body.classList.add('scrollbar-hidden');
                body.style.overflow = 'hidden';
            }
        } else {
            setStyleObj(prevStyle => ({
                ...prevStyle,
                opacity: 0,
                transform: isTransformEffect ? 'translateY(100%)' : undefined,
            }));
            if (body.classList.contains('scrollbar-hidden')) {
                body.classList.remove('scrollbar-hidden');
                body.style.overflow = '';
            }
        }

        // Cleanup on unmount to ensure no hidden overflow persists on back navigation
        return () => {
            if (body.classList.contains('scrollbar-hidden')) {
                body.classList.remove('scrollbar-hidden');
                body.style.overflow = '';
            }
        };
    }, [visibility, isTransformEffect, windowScroll]);

    const childWithProps = children && visibility ? cloneElement(children, {
        ref: elementRef,
        style: { ...children.props.style, ...styleObj },
    }) : null;

    return childWithProps;
};
