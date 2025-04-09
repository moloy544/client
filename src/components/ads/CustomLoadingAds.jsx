"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLink } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';
import { isNotHuman } from '@/utils';

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
      openDirectLink();
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

    if (isNotHuman()) {
      return; // Do not show ads if is not human
    };

    // Create adcash script and append it to document head after document load and 20 seconds later
    const head = document.querySelector("head");
    const mainScriptAppendTimer = setTimeout(() => {
      // Create adcash script tag
      const adcashMainScript = document.createElement("script");
      adcashMainScript.id = "aclib";
      adcashMainScript.type = "text/javascript";
      adcashMainScript.async = true;
      adcashMainScript.src = "//acscdn.com/script/aclib.js";
      head.appendChild(adcashMainScript);
      adcashMainScript.onload = () => {
        if (window) {

          const ids = ['9795498', '9775202', '9754474'];

          // Select a random ID from the array
          const randomId = ids[Math.floor(Math.random() * ids.length)];
          
          window.aclib.runInPagePush({
            zoneId: randomId,
            refreshRate: 30,
            maxAds: 2,
          });
        };
      }
    }, 10000); // 10 seconds delay for ad load

    return () => {
      clearTimeout(mainScriptAppendTimer);
    }
  }, []);

  return null;
};
