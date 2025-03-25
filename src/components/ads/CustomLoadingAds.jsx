"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLinkAd } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';
import { adsConfig } from '@/config/ads.config';
import Script from 'next/script';

// Helper function to get the current time in IST (Indian Standard Time)
const getCurrentISTTime = () => {
  const currentDate = new Date();
  const utcOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  return new Date(currentDate.getTime() + utcOffset + istOffset);
};

export default function CustomLoadingAds() {
  const [adClicked, setAdClicked] = useState(false);
  const location = usePathname();
  const { isSocialjoinModalShow } = useSelector((state) => state.fullWebAccessState);
  const [socialBarAds, setSocialBarAds] = useState(false);

  useEffect(() => {
    const documentBody = document.body;
    const noAdsPaths = ["publisher", "search"];
    const currentPath = location.split('/')[1];

    // If the current path is in noAdsPaths, prevent ad click functionality
    if (noAdsPaths.includes(currentPath) || isSocialjoinModalShow) return;

    const handleClick = () => {
      if (adClicked) return;

      // Open direct ad on first user click
      openDirectLinkAd();
      setAdClicked(true);

      const user = safeLocalStorage.get('utId');
      if (!user) {
        const randomId = generateRandomID(15);
        safeLocalStorage.set('utId', randomId);
      }
    };

    documentBody.addEventListener("click", handleClick, { once: true });
    return () => {
      documentBody.removeEventListener("click", handleClick);
    };
  }, [adClicked, location, isSocialjoinModalShow]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentISTTime = getCurrentISTTime();
      const currentHour = currentISTTime.getHours();
      const currentMinute = currentISTTime.getMinutes();

      // Show social bar ads between 2:00 AM IST and 5:30 AM IST
      if (currentHour >= 2 && currentHour < 5 || (currentHour === 5 && currentMinute < 30)) {
        setSocialBarAds(true); // Show social bar ads
      } else {
        setSocialBarAds(false); // Hide social bar ads
      }
    }, 20000); // 20 seconds delay for ad load

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {socialBarAds && (
        <Script
          async={true}
          src={adsConfig.socialBarAdScriptSrc}
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
