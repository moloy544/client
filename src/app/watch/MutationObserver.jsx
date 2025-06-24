'use client';

import { partnerIntegration } from "@/config/ads.config";
import { isNotHuman } from "@/utils";
import { useEffect } from "react";

function IframeObserver() {
  useEffect(() => {
    let observer = null;
    let partnerIntegrationScript = null;
    let partnerIntegrationScript2 = null;
    let observerTimer = null;
    let partnerIntegrationScriptTimer = null;

    // Skip in development
     if (process.env.NODE_ENV === 'development') return;

    // Start observing unwanted iframes
    const startObserver = () => {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.tagName === 'IFRAME') {
              const iframe = node;
              if (iframe.id === 'player-embedded-iframe') continue;

              const removeDelay = Math.floor(Math.random() * 1001) + 4000; // 4000–5000 ms

              setTimeout(() => {
                try {
                  iframe.remove(); // emove iframe
                } catch {
                  iframe.setAttribute('style', 'display: none !important'); // Fallback: hide it
                }
              }, removeDelay);

            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    };

    // Inject ad scripts
    const injectAdScripts = () => {
      // Script 1
      partnerIntegrationScript = document.createElement("script");
      partnerIntegrationScript.type = "text/javascript";
      partnerIntegrationScript.id = 'partnerIntegration-script';
      partnerIntegrationScript.async = true;
      partnerIntegrationScript.src = partnerIntegration.seconderyAccounts.dipti544.socialBarScript;
      document.body.appendChild(partnerIntegrationScript);

      // Script 2
      //const partnerIntegration2ScitipConfig = partnerIntegration.clickadu.inpagePushSCofig;
      //partnerIntegrationScript2 = document.createElement("script");
      //partnerIntegrationScript2.async = true;
      //partnerIntegrationScript2.setAttribute("data-cfasync", partnerIntegration2ScitipConfig.cfasync);
      //partnerIntegrationScript2.setAttribute("data-clipid", partnerIntegration2ScitipConfig.clipid);
      //partnerIntegrationScript2.src = partnerIntegration2ScitipConfig.src;
      //document.body.appendChild(partnerIntegrationScript2);
    };

    // Delay settings
    const randomDelay = isNotHuman()
      ? Math.floor(Math.random() * 5000) + 30000     // Bot: 30–35 sec
      : Math.floor(Math.random() * 5000) + 15000;    // Human: 15–20 sec

    // Set timers
    observerTimer = setTimeout(startObserver, randomDelay);
    partnerIntegrationScriptTimer = setTimeout(injectAdScripts, randomDelay + 500);

    // Cleanup on unmount
    return () => {
      clearTimeout(observerTimer);
      clearTimeout(partnerIntegrationScriptTimer);

      try {
        if (partnerIntegrationScript && document.body.contains(partnerIntegrationScript)) {
          document.body.removeChild(partnerIntegrationScript);
        }
        if (partnerIntegrationScript2 && document.body.contains(partnerIntegrationScript2)) {
          document.body.removeChild(partnerIntegrationScript2);
        }
      } catch { }

      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}

export default IframeObserver;
