'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openDirectLink } from '@/utils/ads.utility';
import { useSelector } from 'react-redux';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { generateRandomID } from '@/helper/helper';
import { isNotHuman } from '@/utils';
import { appConfig } from '@/config/config';

const validateDomain = () => {
  const allowedDomains = ['moviesbazar.net', 'www.moviesbazar.net'];
  const currentDomain = window.location.hostname;
  if (!allowedDomains.includes(currentDomain)) {
    const currentPath = window.location.pathname || '/';
    window.location.href = `${appConfig.appDomain}${currentPath}`;
  }
};

export default function CustomLoadingAds() {
  const [adClicked, setAdClicked] = useState(false);
  const location = usePathname();
  const { isSocialjoinModalShow } = useSelector((state) => state.fullWebAccessState);

  useEffect(() => {
    const noAdsPaths = ["publisher", "search", "dmca-admin"];
    const currentPath = location.split('/')[1];

    if (noAdsPaths.includes(currentPath) || isSocialjoinModalShow) return;

    const handleClick = () => {
      if (adClicked) return;

      openDirectLink();
      setAdClicked(true);

      if (!safeLocalStorage.get('utId')) {
        const randomId = generateRandomID(15);
        safeLocalStorage.set('utId', randomId);
      }
    };

    document.body.addEventListener("click", handleClick, { once: true });

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [adClicked, location, isSocialjoinModalShow]);

  useEffect(() => {
    // Check if the current path is a publisher page
    if (location.includes('publisher')) return;

    if (process.env.NODE_ENV === 'production') {
      validateDomain();
    };

    const delay = isNotHuman() ? 30000 : 10000;

    const mainScriptAppendTimer = setTimeout(() => {
      if (!document.getElementById("aclib")) {
        const adcashMainScript = document.createElement("script");
        adcashMainScript.id = "aclib";
        adcashMainScript.type = "text/javascript";
        adcashMainScript.async = true;
        adcashMainScript.src = "//acscdn.com/script/aclib.js";

        adcashMainScript.onload = () => {
          if (window.aclib) {
            window.aclib.runInPagePush({
              zoneId: '9775202',
              refreshRate: 30,
              maxAds: 2,
            });
          }
        };

        document.head.appendChild(adcashMainScript);
      }
    }, delay); // Delay ad script injection by 10 or 30 seconds

    return () => {
      clearTimeout(mainScriptAppendTimer);
    };
  }, []);

  return null;
}
