"use client";

import { openDirectLinkAd } from '@/utils/ads.utility';
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

      // Run the direct ad link function, tied directly to the first user click
      openDirectLinkAd();

      // Set adClicked to true to prevent further ad clicks
      setAdClicked(true);
    };

    // Add the click event listener to the document body (user's first click anywhere on the page)
    documentBody.addEventListener("click", handleClick, { once: true });

    // Clean up the event listener on component unmount or location change
    return () => {
      documentBody.removeEventListener("click", handleClick);
    };
  }, [adClicked, location]);

  return null; // No visual output; just manages the ad click functionality
}
