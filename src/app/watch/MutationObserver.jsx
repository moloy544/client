'use client';

import { partnerIntegration } from "@/config/ads.config";
import { useEffect } from "react";

function IframeObserver() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return; // Skip in development mode
    };

    let observer = null;
    let partnerIntegrationScript = null;
    let observerTimer = null;
    let partnerIntegrationScriptTimer = null;

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
              }, 1000); // instantly remove the iframe
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
    const injectAdsScript = () => {

      // Create  partnerIntegrationScript tag
      partnerIntegrationScript = document.createElement("script");
      partnerIntegrationScript.type = "text/javascript";
      partnerIntegrationScript.id = 'partnerIntegration-script'
      partnerIntegrationScript.async = true;
      partnerIntegrationScript.src = partnerIntegration.seconderyAccounts.dipti544.socialBarScript;
      document.body.appendChild(partnerIntegrationScript);
    };

    observerTimer = setTimeout(startObserver, 120000);        // 2 minutes = 180,000 ms
    partnerIntegrationScriptTimer = setTimeout(injectAdsScript, 125000); // 2 minutes 5 seconds = 125,000 ms

    return () => {
      clearTimeout(observerTimer);
      clearTimeout(partnerIntegrationScriptTimer);
      // Cleanup the observer and script
      if (partnerIntegrationScript && document.body.contains(partnerIntegrationScript)) {
        document.body.removeChild(partnerIntegrationScript);
      }

      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}

export default IframeObserver;
