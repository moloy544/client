import { adsConfig } from "@/config/ads.config";

export const openDirectLinkAd = () => {
    if (process.env.NODE_ENV !== 'development') return;

    // Use a less obvious key name like '__adc_ct_0987' for storing the click count
    const storageKey = '__adc_ct_0987';

    // Retrieve the stored click count from localStorage or initialize it to 0
    let clickCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

    // Check whether it's an odd or even click
    const isOddClick = clickCount % 2 !== 0;

      // Select the direct link based on the click count
    const currentDirectLink = isOddClick
    ? adsConfig.seconderyAccount.direct_Link // Secondary account link for odd clicks
    : adsConfig.direct_Link;                 // Primary account link for even clicks

    // Create a new anchor element
    const link = document.createElement('a');
    link.href = currentDirectLink;           // Set the href to the current direct ad link
    link.target = '_blank';                  // Open the link in a new tab
    link.rel = 'noopener noreferrer';        // Ensure security with 'noopener noreferrer'

    // Append the anchor to the body (this step is required for Safari)
    document.body.appendChild(link);

    // Trigger a click on the anchor
    link.click();

    // Remove the anchor after clicking
    document.body.removeChild(link);

    // Increment the click count
    clickCount++;

    // Reset click count to 0 after 10 clicks
    if (clickCount >= 10) {
        clickCount = 0;
    }

    // Store the updated click count back into localStorage with the less obvious key
    localStorage.setItem(storageKey, clickCount.toString());
};
