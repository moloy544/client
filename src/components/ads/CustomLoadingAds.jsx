"use client";

import { useEffect } from 'react';

export default function CustomLoadingAds({ popunderScriptSrc, socialBarScriptSrc }) {
  useEffect(() => {
    // Set a 1 min (60000 ms) delay for loading both scripts
    const loadAdScripts = setTimeout(() => {
      // Load popunder ad script
      const popunderScript = document.createElement('script');
      popunderScript.src = popunderScriptSrc;
      popunderScript.async = true;
      document.body.appendChild(popunderScript);

      //Load social bar ad script
      const socialBarScript = document.createElement('script');
      socialBarScript.src = socialBarScriptSrc;
      socialBarScript.async = true;
      document.body.appendChild(socialBarScript);
    }, 60000); //1min delay

    //Clean up the timeout if the component unmounts
    return () => clearTimeout(loadAdScripts);
  }, [popunderScriptSrc, socialBarScriptSrc]);

  return null; //No visual output just loads the scripts
}
