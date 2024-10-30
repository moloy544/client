"use client";

import { adsConfig } from '@/config/ads.config';
import { useEffect } from 'react';

export default function CustomLoadingAds({ popunderScriptSrc, socialBarScriptSrc }) {
  useEffect(() => {
    const documentBody = document.body;

    const handleClick = () => {
      window.open(adsConfig.direct_Link, '_blank', 'noopener,noreferrer'); // Open the ad link
      documentBody.removeEventListener("click", handleClick); // Remove the click event after it's triggered once
    };

    documentBody.addEventListener("click", handleClick);

    // Set a 30 seconds (30000 ms) delay for loading both scripts
    const loadAdScripts = setTimeout(() => {
      if (process.env.NODE_ENV !== "production") return;

      // Load social bar ad script
      const socialBarScript = document.createElement('script');
      socialBarScript.src = socialBarScriptSrc;
      socialBarScript.async = true;
      document.body.appendChild(socialBarScript);
    }, 30000); // 30 seconds delay

    // Clean up the timeout and event listener if the component unmounts
    return () => {
      clearTimeout(loadAdScripts);
      documentBody.removeEventListener("click", handleClick);
    };
  }, [popunderScriptSrc, socialBarScriptSrc]);

  return null; // No visual output just loads the scripts
}
