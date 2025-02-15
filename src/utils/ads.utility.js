import { adsConfig } from "@/config/ads.config";

export const openDirectLinkAd = () => {

    if (process.env.NODE_ENV === 'development') return;

    // Create a new anchor element
    const link = document.createElement('a');
    link.href = adsConfig.direct_Link;           // Set the href to the direct ad link
    link.target = '_blank';            // Open the link in a new tab
    link.rel = 'noopener noreferrer';  // Ensure security with 'noopener noreferrer'

    // Append the anchor to the body (this step is required for Safari)
    document.body.appendChild(link);

    // Trigger a click on the anchor
    link.click();

    // Remove the anchor after clicking
    document.body.removeChild(link);

};