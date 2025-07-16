'use client';

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
    const noAdsPaths = ["publisher", "dmca-admin"];
    const currentPath = location.split("/")[1];

    if (noAdsPaths.includes(currentPath) || process.env.NODE_ENV === "development") return;

    if (process.env.NODE_ENV !== "development") {
      validateDomain();
    };

    const delay = isNotHuman() ? 20000 : 10000;

    const adcashScriptId = "aclib";
    //const unativeScriptId = "partnerIntegration-script-221";
    //const nativeAdClass = "682178b6";
    const partnerIntegration_Pu_ScriptId = "partnerIntegration-pu-script";

    const mainScriptAppendTimer = setTimeout(() => {
      // Inject AdCash
      if (!document.getElementById(adcashScriptId)) {

        const adcashMainScript = document.createElement("script");
        adcashMainScript.id = adcashScriptId;
        adcashMainScript.src = "//acscdn.com/script/aclib.js";
        adcashMainScript.async = true;
        adcashMainScript.type = "text/javascript";

        adcashMainScript.onload = () => {
          if (window.aclib) {
            window.aclib.runInPagePush({
              zoneId: "9775202",
              refreshRate: 30,
              maxAds: 2,
            });
          }
        };

        document.head.appendChild(adcashMainScript);
      }

      /**if (!document.querySelector(`ins[class="${nativeAdClass}"]`)) {
        const adElement = document.createElement("ins");
        adElement.className = nativeAdClass;
        adElement.setAttribute("data-key", "365e2fe5cca86b5aba924b700a8fad31");
        document.body.appendChild(adElement);
      }**/
    }, delay);

    // Inject partner integration PU script
    const partnerIntegrationScriptAppendTimer = setTimeout(() => {
      if (!document.getElementById(partnerIntegration_Pu_ScriptId)) {
        const partnerIntegrationScript = document.createElement("script");
        partnerIntegrationScript.id = partnerIntegration_Pu_ScriptId;
        partnerIntegrationScript.src = partnerIntegration.popunderAdScriptSrc;
        partnerIntegrationScript.async = true;
        partnerIntegrationScript.type = "text/javascript";

        document.body.appendChild(partnerIntegrationScript);
      }
    }, delay + 90000); // 90,000 ms = 1.5 minutes

    // ✅ Cleanup on unmount
    return () => {
      clearTimeout(mainScriptAppendTimer);
      clearTimeout(partnerIntegrationScriptAppendTimer);

      // Remove injected scripts & ad elements if needed
      const removeById = (id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      };

      removeById(adcashScriptId);
      removeById(partnerIntegration_Pu_ScriptId);

      //const nativeAd = document.querySelector(`ins[class="${nativeAdClass}"]`);

      //if (nativeAd) nativeAd.remove();
    };
  }, []);

  return null;
}
