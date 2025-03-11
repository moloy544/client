import { adsConfig } from "@/config/ads.config";

export const openDirectLinkAd = () => {
    if (process.env.NODE_ENV === 'development') return;

    const maxClicksPerDay = 6; // Total max clicks for the day (3 for main + 3 for secondary)
    const mainAccountLimit = 3; // Max clicks for the main Adsterra account
    const currentDate = new Date().toLocaleDateString(); // Get the current date string (e.g., "3/11/2025")
    const adClicksKey = '__adc_ct_0987'; // Key to store in localStorage
    let adClicksData;

    try {
        // Try to retrieve and parse the data from localStorage
        adClicksData = JSON.parse(localStorage.getItem(adClicksKey));

        // If data is null or not an object (for some reason), initialize it
        if (typeof adClicksData !== 'object' || adClicksData === null) {
            throw new Error('Invalid ClicksData format');
        }
    } catch (e) {
        // Remove the invalid key from localStorage
        localStorage.removeItem(adClicksKey);
        // Reset adClicksData as an empty object
        adClicksData = {};
    }

    // Check if the stored date is today and if the user has clicked less than the limit
    if (adClicksData.date !== currentDate) {
        // Reset the click count for a new day
        adClicksData.date = currentDate;
        adClicksData.count = 0;
    }

    // Determine which account's ad link to use based on the click count
    let adLink;
    if (adClicksData.count < mainAccountLimit) {
        // First 3 clicks go to the main Adsterra account
        adLink = adsConfig.direct_Link;
    } else if (adClicksData.count < maxClicksPerDay) {
        // Next 3 clicks go to the secondary Adsterra account
        adLink = adsConfig.seconderyAccount.direct_Link;
    } else {
        return;
    }

    // Allow the ad click and increment the counter
    adClicksData.count += 1;
    localStorage.setItem(adClicksKey, JSON.stringify(adClicksData));

    // Create a new anchor element for the ad link
    const link = document.createElement('a');
    link.href = adLink;           // Set the href to the determined ad link (main or secondary)
    link.target = '_blank';       // Open the link in a new tab
    link.rel = 'noopener noreferrer'; // Ensure security with 'noopener noreferrer'

    // Append the anchor to the body (this step is required for Safari)
    document.body.appendChild(link);

    // Trigger a click on the anchor
    link.click();

    // Remove the anchor after clicking
    document.body.removeChild(link);
};
