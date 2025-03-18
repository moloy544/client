import { adsConfig } from "@/config/ads.config";

let adClickCount = 0;

// handle direct link ad append ancor tag in body open automatically and remove link form body
export const openDirectLinkAd = () => {

    try {
        if (process.env.NODE_ENV === 'development') return;

        // Determine which ad link to use based on odd/even click count
        const directLinkAd = adClickCount % 2 === 0 ? adsConfig.direct_Link : adsConfig.direct_Link2;

        // Create and append an anchor tag to open the ad link
        const link = document.createElement('a');
        link.href = directLinkAd; // href ad link
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        adClickCount++; // Increment the click count
    } catch (error) {
        console.error('Error opening direct link:', error);
    }
};
