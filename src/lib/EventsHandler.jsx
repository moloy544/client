import { cloneElement, useEffect, useRef, useState } from "react";

const ModelsController = ({ children, visibility, closeEvent }) => {

    const elementRef = useRef(null);

    // State to manage the style dynamically based on visibility
    const [style, setStyle] = useState({
        transition: 'opacity 0.3s ease',
        opacity: 0 // Start as fully transparent
    });

    //hide model while window scroll
    const handleScroll = () => {

        if (window.scrollY > 100 && visibility) {
            closeEvent();
        };
    };

    //hide model on outside click
    const outsideClickHandler = ({ target }) => {
        if (!elementRef.current) return;
        if (!visibility || elementRef.current.contains(target)) return;
        closeEvent();
    };

    //All events listeners for close model
    useEffect(() => {

        document.addEventListener('click', outsideClickHandler);

        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('click', outsideClickHandler);
            window.removeEventListener('scroll', handleScroll);
        };

    }, [visibility, closeEvent, handleScroll]);

    // Apply opacity based on visibility
    useEffect(() => {
        if (visibility) {
            setStyle(prevStyle => ({ ...prevStyle, opacity: 1 })); // Become fully opaque
        } else {
            setStyle(prevStyle => ({ ...prevStyle, opacity: 0 })); // Become fully transparent
        }
    }, [visibility]);


    //hide model while window scroll event listeners
    useEffect(() => {


    }, [handleScroll]);


    // Merge existing child styles with new styles and apply ref
    const childWithProps = cloneElement(children, {
        ref: elementRef,
        style: { ...children.props.style, ...style } // Safely merge with existing styles
    });

    return childWithProps;
};

export { ModelsController };
