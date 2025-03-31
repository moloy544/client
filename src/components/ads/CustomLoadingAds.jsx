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

  return null;
};
