import { partnerIntegration } from "@/config/ads.config";
import { safeLocalStorage } from "./errorHandlers";

// Completely generic and non-descriptive key for storing the ad click count in localStorage
const obfuscatedKey = 'userSessionCount_8972jdf';  // Random key without any mention of ads

// In-memory ad click count fallback
let inMemoryAdClickCount = 0;

export const openDirectLinkAd = () => {
    try {
        if (process.env.NODE_ENV === 'development') return;

        let adClickCount;

        // Attempt to fetch ad click count from localStorage, otherwise fallback to in-memory count
        try {
            adClickCount = parseInt(safeLocalStorage.get(obfuscatedKey), 10);
            if (isNaN(adClickCount)) {
                adClickCount = inMemoryAdClickCount;
            }
        } catch (error) {
            //console.warn('localStorage unavailable, using in-memory ad click count.');
            adClickCount = inMemoryAdClickCount;
        }

        // Cycle through only 3 ad links
        let directLinkAd;
        if (adClickCount % 3 === 0) {
            directLinkAd = partnerIntegration.direct_Link;
        } else if (adClickCount % 3 === 1) {
            directLinkAd = partnerIntegration.direct_Link2;
        } else {
            directLinkAd = partnerIntegration.direct_Link3;
        }

        // Create and append an anchor tag to open the ad link
        const link = document.createElement('a');
        link.href = directLinkAd;
        link.target = '_blank';
        link.rel = 'nofollow noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Increment the click count
        adClickCount++;

        // Reset the ad click count after the 4th click
        if (adClickCount % 4 === 0) {
            adClickCount = 0;
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
