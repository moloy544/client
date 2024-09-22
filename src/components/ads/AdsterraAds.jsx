'use client';

import { memo, useEffect } from 'react';

const areEqual = (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.adOptions) === JSON.stringify(nextProps.adOptions) &&
        JSON.stringify(prevProps.nativeBannerAd) === JSON.stringify(nextProps.nativeBannerAd) &&
        JSON.stringify(prevProps.bannerAd) === JSON.stringify(nextProps.bannerAd)
    );
};

const AdsterraAds = memo(({ adOptions, bannerAd = true, nativeBannerAd = true }) => {
    useEffect(() => {
        const adContainer = document.getElementById('adsterra-ads');

        // Check if banner ads should be shown
        if (bannerAd) {
            // Adsterra Ad Script
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

            // Append Adsterra scripts to the ad container
            adContainer.appendChild(adsterraScript);
            adContainer.appendChild(adsterraScriptSrc);
        }

        // Check if native banner ads should be shown
        if (nativeBannerAd) {
            // Native Ad Script
            const nativeAdScript = document.createElement('script');
            nativeAdScript.async = true;
            nativeAdScript.setAttribute('data-cfasync', 'false');
            nativeAdScript.src = '//filthygracefulspinach.com/b10a3b8d85dad76c5089c6f7947c1bb2/invoke.js';

            // Native Ad Container
            const nativeAdContainer = document.createElement('div');
            nativeAdContainer.id = 'container-b10a3b8d85dad76c5089c6f7947c1bb2';
            nativeAdContainer.className = 'flex flex-wrap justify-between overflow-x-auto'; // Tailwind classes

            // Append native ad script and container to the ad container
            adContainer.appendChild(nativeAdScript);
            adContainer.appendChild(nativeAdContainer);
        }

        return () => {
            // Cleanup
            while (adContainer.firstChild) {
                adContainer.removeChild(adContainer.firstChild);
            }
        };
    }, [adOptions, bannerAd, nativeBannerAd]);

    return <div className="w-full h-auto flex justify-center flex-wrap overflow-x-scroll scrollbar-hidden py-2.5 px-1.5" id="adsterra-ads"></div>;
}, areEqual);

export default AdsterraAds;

AdsterraAds.displayName = "AdsterraAds";
