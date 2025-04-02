"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLinkAd } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';

function isNotHuman() {

  if (typeof window === 'undefined') {
    return true;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    /bot/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /mediapartners/i,
    /adsbot/i,
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /baiduspider/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
};

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
          window.aclib.runInPagePush({
            zoneId: '9754474',
            refreshRate: 30,
            maxAds: 2,
          });
        };
      }
    }, 20000); // 20 seconds delay for ad load

    return () => {
      clearTimeout(mainScriptAppendTimer);
    }
  }, []);

  return null;
};
