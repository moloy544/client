"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { openDirectLinkAd } from '@/utils/ads.utility';

export default function CustomLoadingAds() {
  const [adClicked, setAdClicked] = useState(false);
  const [loadAds, setLoadAds] = useState(false); // Control when to load ads
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

  // Delay the loading of the ad script by 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadAds(true); // Set to true after 20 seconds
    }, 20000); // 20 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {loadAds && (
        <Script
          async={true}
          src="//filthygracefulspinach.com/43/98/8c/43988ce9b59be4684da90ce3bf3e71c5.js"
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
