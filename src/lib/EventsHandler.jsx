"use client";

import { cloneElement, useEffect, useRef, useState } from "react";

const ModelsController = ({ children, visibility, closeEvent, transformEffect = false, windowScroll = true }) => {

    const initialStyle = {
        transition: transformEffect ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.5s ease',
        opacity: 0, // Start as fully transparent
    };

    const elementRef = useRef(null);
    const [styleObj, setStyleObj] = useState(initialStyle);

    const body = document.querySelector('body');

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
        document.addEventListener('contextmenu', rightClickHandler); // Handle right-click events

        return () => {
            document.removeEventListener('click', outsideClickHandler);
            document.removeEventListener('contextmenu', rightClickHandler);
        };
    }, [visibility, closeEvent]);

    useEffect(() => {
        if (visibility) {
            setStyleObj(prevStyle => ({
                ...prevStyle,
                opacity: 1,
                transform: transformEffect ? 'translateY(0)' : undefined, // Move to center if transformEffect is true
            }));
            if (windowScroll===false) {
                body.setAttribute('class', 'scrollbar-hidden');
                body.style.overflow = 'hidden';   
            }
            
        } else {
            setStyleObj(prevStyle => ({
                ...prevStyle,
                opacity: 0,
                transform: transformEffect ? 'translateY(100%)' : undefined, // Move to bottom if transformEffect is true
            }));
            body.removeAttribute('class', 'scrollbar-hidden');
            body.style.overflow = '';
        }
    }, [visibility, transformEffect]);

    const childWithProps = children && visibility ? cloneElement(children, {
        ref: elementRef,
        style: { ...children.props.style, ...styleObj },
    }) : null;

    return childWithProps;
};

export { ModelsController };
