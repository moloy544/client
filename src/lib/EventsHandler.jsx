'use client'

import { cloneElement, useEffect, useRef, useState } from "react";

const ModelsController = ({ children, visibility, closeEvent }) => {
    const elementRef = useRef(null);

    const [style, setStyle] = useState({
        transition: 'opacity 0.3s ease',
        opacity: 0 // Start as fully transparent
    });

    useEffect(() => {
        const outsideClickHandler = ({ target }) => {
            if (!elementRef.current) return;
            if (!visibility || elementRef.current.contains(target) || !closeEvent) return;
            closeEvent();
        };

        document.addEventListener('click', outsideClickHandler);

        return () => {
            document.removeEventListener('click', outsideClickHandler);
        };
    }, [visibility, closeEvent]);

    useEffect(() => {
        if (visibility) {
            setStyle(prevStyle => ({ ...prevStyle, opacity: 1 })); // Become fully opaque
        } else {
            setStyle(prevStyle => ({ ...prevStyle, opacity: 0 })); // Become fully transparent
        }
    }, [visibility]);

    const childWithProps = visibility && children ? cloneElement(children, {
        ref: elementRef,
        style: { ...children.props.style, ...style }
    }) : null;

    return childWithProps;
};

export { ModelsController };
