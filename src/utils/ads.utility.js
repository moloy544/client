import { adsConfig } from "@/config/ads.config";
import { safeLocalStorage } from "./errorHandlers";

// Completely generic and non-descriptive key for storing the ad click count in localStorage
const obfuscatedKey = 'userSessionCount_8972jdf';  // Random key without any mention of ads

// In-memory ad click count fallback
let inMemoryAdClickCount = 0;

export const openDirectLinkAd = () => {
    try {
        if (process.env.NODE_ENV === 'development') return;

        // Attempt to fetch ad click count from localStorage, otherwise fallback to in-memory count
        let adClickCount;
        try {
            adClickCount = parseInt(safeLocalStorage.get(obfuscatedKey), 10);
            if (isNaN(adClickCount)) {
                adClickCount = inMemoryAdClickCount;
            }
        } catch (error) {
            //console.warn('localStorage unavailable, using in-memory ad click count.');
            adClickCount = inMemoryAdClickCount;
        }

        // Cycle through three different ad links based on the click count (modulo 3)
        let directLinkAd;
        if (adClickCount % 3 === 0) {
            directLinkAd = adsConfig.direct_Link;
        } else if (adClickCount % 3 === 1) {
            directLinkAd = adsConfig.direct_Link2;
        } else {
            directLinkAd = adsConfig.direct_Link3
        };

        // Create and append an anchor tag to open the ad link
        const link = document.createElement('a');
        link.href = directLinkAd;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Increment the click count
        adClickCount++;

        // Check if it's the third link click, reset adClickCount to 0
        if (adClickCount % 3 === 0) {
            adClickCount = 0;  // Reset after the third link
        };

        // Save the updated click count back to localStorage (if available) or fallback to in-memory
        try {
            safeLocalStorage.set(obfuscatedKey, adClickCount.toString());
        } catch (error) {
            inMemoryAdClickCount = adClickCount;
        }

    } catch (error) {
        console.error('Error opening direct link:', error);
    }
};
