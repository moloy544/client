import { partnerIntegration } from "@/config/ads.config";

export const openDirectLink = () => {
    try {
        //if (process.env.NODE_ENV === 'development') return;
     
        // Create and append an anchor tag to open the ad link
        const link = document.createElement('a');
        link.href = "https://www.facebook.com" //partnerIntegration.direct_Link;
        link.target = '_blank';
        link.rel = 'nofollow noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error opening direct link:', error);
    }
};
