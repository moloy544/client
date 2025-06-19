'use client';

import { partnerIntegration } from "@/config/ads.config";
import { useEffect } from "react";

function IframeObserver() {
  useEffect(() => {
    let observer = null;
    let admavenScript = null;
    let observerTimer = null;
    let admavenTimer = null;

    // Start observing unwanted iframes
    const startObserver = () => {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.tagName === 'IFRAME') {
              const iframe = node;
              if (iframe.id === 'player-embedded-iframe') continue;

              setTimeout(() => {
                try {
                  iframe.remove(); // Best: remove for performance

                } catch {
                  iframe.setAttribute('style', 'display: none !important');

                }
              }, 100); // instantly remove the iframe
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

    };

    // Inject AdMaven script after 2 minutes
    const injectAdMaven = () => {
      admavenScript = document.createElement("script");
      admavenScript.src = partnerIntegration.adMaven.inpagePushScriptSrc;
      admavenScript.async = true;
      admavenScript.setAttribute("data-cfasync", "false");
      document.head.appendChild(admavenScript);
    };

    observerTimer = setTimeout(startObserver, 80000);     // 1 min 20 sec
    admavenTimer = setTimeout(injectAdMaven, 120000);     // 2 minutes

    return () => {
      clearTimeout(observerTimer);
      clearTimeout(admavenTimer);
      // Cleanup the observer and script
      if (admavenScript && document.head.contains(admavenScript)) {
        document.head.removeChild(admavenScript);
      }

      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}

export default IframeObserver;
