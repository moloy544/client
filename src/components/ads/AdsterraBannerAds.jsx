'use client';

import { memo, useEffect } from 'react';

// Memoization to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.adOptions) === JSON.stringify(nextProps.adOptions) &&
    prevProps.bannerAd === nextProps.bannerAd
  );
};

const AdsterraAds = memo(({ adOptions, bannerAd = true }) => {

    useEffect(() => {
        const loadAds = () => {
            const adContainer = document.getElementById('adsterra-ads');
            
            // Ensure ads load only if container exists
            if (!adContainer) return;

            // Load banner ad
            if (bannerAd) {
                const adsterraScript = document.createElement('script');
                adsterraScript.type = 'text/javascript';
                adsterraScript.innerHTML = `
                  atOptions = {
                    'key' : '${adOptions.key}',
                    'format' : 'iframe',
                    'height' : ${adOptions.height},
                    'width' : ${adOptions.width},
                    'params' : {}
                  };
                `;
                const adsterraScriptSrc = document.createElement('script');
                adsterraScriptSrc.type = 'text/javascript';
                adsterraScriptSrc.src = `//www.topcreativeformat.com/${adOptions.key}/invoke.js`;
                adsterraScriptSrc.async = true;
                
                adContainer.appendChild(adsterraScript);
                adContainer.appendChild(adsterraScriptSrc);
            }

            // Load native ad
            /**if (nativeBannerAd) {
                const nativeAdContainer = document.createElement('div');
                nativeAdContainer.id = 'container-b10a3b8d85dad76c5089c6f7947c1bb2';
                nativeAdContainer.className = 'flex flex-wrap justify-between overflow-x-auto';

                const nativeAdScript = document.createElement('script');
                nativeAdScript.async = true;
                nativeAdScript.setAttribute('data-cfasync', 'false');
                nativeAdScript.src = '//filthygracefulspinach.com/b10a3b8d85dad76c5089c6f7947c1bb2/invoke.js';

                adContainer.appendChild(nativeAdContainer);
                adContainer.appendChild(nativeAdScript);
            }**/
        };

        if (document.readyState === 'complete') {
           loadAds(); // If page is already fully loaded
        } else {
            window.addEventListener('load', loadAds); // Listen for page load event
        }

        // Cleanup on unmount and event listener removal
        return () => {
            window.removeEventListener('load', loadAds);
            const adContainer = document.getElementById('adsterra-ads');
            if (adContainer) {
                while (adContainer.firstChild) {
                    adContainer.removeChild(adContainer.firstChild);
                }
            }
        };
    }, [adOptions, bannerAd]);

    return <div className="w-full h-auto flex justify-center items-center flex-wrap overflow-x-scroll scrollbar-hidden py-1" id="adsterra-ads"></div>;
}, areEqual);

export default AdsterraAds;

AdsterraAds.displayName = "AdsterraAds";
