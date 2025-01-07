"use client";

import { adsConfig } from '@/config/ads.config';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function CustomLoadingAds() {
  const [adClicked, setAdClicked] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const documentBody = document.body;

    const noAdsPaths = ["publisher", "search"];
    const currentPath = location.split('/')[1];

    // If the current path is in noAdsPaths, prevent ad click functionality
    if (noAdsPaths.includes(currentPath)) return;

    const handleClick = () => {
      // Prevent multiple ad clicks
      if (adClicked) return;

      let link = adsConfig.direct_Link;
      if (currentPath.includes('watch')) {
        link = adsConfig.seconderyAccount.direct_Link;
      };

      // Open the ad link in a new tab with security measures
      window.open(link, '_blank', 'noopener,noreferrer');

      // Set adClicked to true to prevent further ad clicks
      setAdClicked(true);
    };

    // Add the click event listener to the document body
    documentBody.addEventListener("click", handleClick);

    // Clean up the event listener on component unmount or location change
    return () => {
      documentBody.removeEventListener("click", handleClick);
    };
  }, [adClicked, location]);

  return null; // No visual output; just manages the ad click functionality
}