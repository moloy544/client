'use client'

import { useEffect } from "react";

function IframeObserver() {
  useEffect(() => {

    let observer = null;

    // Start observing after 60 seconds
    const startObserverTimer = setTimeout(() => {

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.tagName === 'IFRAME') {
              const iframe = node;

                // Allow only the specific iframe with id 'player-embedded-iframe'
              if (iframe.id === 'player-embedded-iframe') {
                return;
              }
              
              // Block all other iframes
              iframe.remove();
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }, 60000); // Delay of 60s

    return () => {
      clearTimeout(startObserverTimer);
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}

export default IframeObserver;
