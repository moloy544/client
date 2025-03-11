// Ads configuration
import { adsConfig } from "@/config/ads.config";
import { safeLocalStorage } from "./errorHandlers";

// Helper function to get current time in IST (UTC +5:30)
const getCurrentISTTime = () => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60000; // Get offset in milliseconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 hours
    return new Date(currentDate.getTime() + utcOffset + istOffset);
};

// Function to check if it's past 5:30 AM IST
const isPastResetTimeIST = () => {
    const currentIST = getCurrentISTTime();
    const resetHour = 5;  // 5:30 AM IST
    const resetMinute = 30;

    return currentIST.getHours() > resetHour || 
           (currentIST.getHours() === resetHour && currentIST.getMinutes() >= resetMinute);
};

// Function to open ads with global reset at 5:30 AM IST
export const openDirectLinkAd = () => {
    if (process.env.NODE_ENV === 'development') return;

    if (safeLocalStorage.get('__adc_ct_0987')) {
        safeLocalStorage.removeItem('__adc_ct_0987');
    }

    const maxClicksPerDay = 6;  // Total max clicks (3 for main, 3 for secondary)
    const adClicksKey = '__adc_ct_0988'; // Key for localStorage
    let adClicksData;
    const currentDate = getCurrentISTTime().toLocaleDateString();

    try {
        adClicksData = JSON.parse(localStorage.getItem(adClicksKey));

        // Initialize if the format is invalid
        if (typeof adClicksData !== 'object' || adClicksData === null) {
            throw new Error('Invalid adClicksData format');
        }
    } catch (e) {
        // Remove invalid key from localStorage and reset
        localStorage.removeItem(adClicksKey);
        adClicksData = {};
    }

    // Check if the clicks need to be reset for a new day (past 5:30 AM IST)
    if (adClicksData.date !== currentDate || isPastResetTimeIST()) {
        adClicksData.date = currentDate;
        adClicksData.count = 0;
    }

    if (adClicksData.count < maxClicksPerDay) {
        adClicksData.count += 1; // Increment count
        localStorage.setItem(adClicksKey, JSON.stringify(adClicksData));

        // Create and trigger ad link
        const link = document.createElement('a');
        link.href = adsConfig.direct_Link;  // Main account ad link
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // Show secondary account ad link if click limit reached
        const link = document.createElement('a');
        link.href = adsConfig.seconderyAccount.direct_Link; // Secondary account ad link
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
