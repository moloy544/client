"use client";

import { cloneElement, useEffect, useRef, useState } from "react";

export const ModelsController = ({ children, visibility, closeEvent, transformEffect = false, windowScroll = true }) => {
    const initialStyle = {
        transition: transformEffect ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.5s ease',
        opacity: 0,
    };

    const elementRef = useRef(null);
    const [styleObj, setStyleObj] = useState(initialStyle);

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
                transform: transformEffect ? 'translateY(0)' : undefined,
            }));
            if (windowScroll === false && !body.classList.contains('scrollbar-hidden')) {
                body.classList.add('scrollbar-hidden');
                body.style.overflow = 'hidden';
            }
        } else {
            setStyleObj(prevStyle => ({
                ...prevStyle,
                opacity: 0,
                transform: transformEffect ? 'translateY(100%)' : undefined,
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
    }, [visibility, transformEffect, windowScroll]);

    const childWithProps = children && visibility ? cloneElement(children, {
        ref: elementRef,
        style: { ...children.props.style, ...styleObj },
    }) : null;

    return childWithProps;
};


export const VirtualizedComponent = ({ children, rootMargin = '200px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);  // Start rendering when the element is near or in the viewport
          } else {
            setIsVisible(false); // Stop rendering when it's far from the viewport
          }
        });
      },
      {
        root: null, // Relative to the viewport
        rootMargin, // Start observing earlier (200px outside the viewport)
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const element = elementRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin]);

  // Clone the child element and attach the ref to it
  const childWithRef = cloneElement(children, { ref: elementRef });

  return isVisible ? childWithRef : null;
};
