// Ads configuration
import { adsConfig } from "@/config/ads.config";

// handle direct link ad append ancor tag in body open automatically and remove link form body
export const openDirectLinkAd = () => {

    try {
        if (process.env.NODE_ENV === 'development') return;

        const link = document.createElement('a');
        link.href = adsConfig.direct_Link; // href ad link
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error opening direct link:', error);

    }
};
