'use client'

import { useEffect } from "react";

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

