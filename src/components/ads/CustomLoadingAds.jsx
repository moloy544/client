"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLinkAd } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';

export default function CustomLoadingAds() {

  const [adClicked, setAdClicked] = useState(false);
  const location = usePathname();

  const { isSocialjoinModalShow } = useSelector((state) => state.fullWebAccessState);

  useEffect(() => {
    const documentBody = document.body;
    const noAdsPaths = ["publisher", "search"];
    const currentPath = location.split('/')[1];

    // If the current path is in noAdsPaths, prevent ad click functionality
    if (noAdsPaths.includes(currentPath) || isSocialjoinModalShow) return;

    const handleClick = () => {
      // Prevent multiple ad clicks
      if (adClicked) return;

      // Run the direct ad link function, tied directly to the first user click
      openDirectLinkAd();

      // Set adClicked to true to prevent further ad clicks
      setAdClicked(true);
        
      const user = safeLocalStorage.get('utId');
      if (!user) {
        // New user: Set random ID and do not show modal
        const randomId = generateRandomID(15);
        safeLocalStorage.set('utId', randomId); 
      }
      
    };

    // Add the click event listener to the document body (user's first click anywhere on the page)
    documentBody.addEventListener("click", handleClick, { once: true });

    // Clean up the event listener on component unmount or location change
    return () => {
      documentBody.removeEventListener("click", handleClick);
    };
  }, [adClicked, location, isSocialjoinModalShow]);

  return null
}
