"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLink } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';
import { isNotHuman } from '@/utils';
import { appConfig } from '@/config/config';
import { partnerIntegration } from '@/config/ads.config';

const validateDomain = () => {
  const allowedDomains = ['moviesbazar.net', 'www.moviesbazar.net'];
  const currentDomain = window.location.hostname;
  const isValidDomain = allowedDomains.includes(currentDomain);
  if (!isValidDomain) {
    if (window && typeof window.location !== 'undefined') {
      const currentPath = window.location.pathname || '/';
      if (currentPath) {
        window.location.href = `${appConfig.appDomain}${currentPath}`;
      };
    };
  };
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

    if (process.env.NODE_ENV === 'production') {
      // validate the domain
      validateDomain()
    }

    // Create adcash script and append it to document head after document load and 20 seconds later
    //const head = document.querySelector("head");
    //const mainScriptAppendTimer = setTimeout(() => {
    // Create adcash script tag
    //const adcashMainScript = document.createElement("script");
    //adcashMainScript.id = "aclib";
    //adcashMainScript.type = "text/javascript";
    //adcashMainScript.async = true;
    //adcashMainScript.src = "//acscdn.com/script/aclib.js";
    //head.appendChild(adcashMainScript);
    //adcashMainScript.onload = () => {
    //if (window) {
    //window.aclib.runInPagePush({
    //zoneId: '9775202',
    //refreshRate: 30,
    //maxAds: 2,
    //});
    //};
    //}
    //}, 10000); // 10 seconds delay for ad load


    // Handle adsterra in-page push
    const body = document.querySelector("body");

    const scriptAppendTimer = setTimeout(() => {
      // Create adcash script tag
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = partnerIntegration.seconderyAccounts.dipti544.socialBarScript;
      body.appendChild(script);
    }, 10000); // 10 seconds delay for ad load

    return () => {
      clearTimeout(scriptAppendTimer);
    }
  }, []);

  return null;
};
