// Function to safely access localStorage
export const safeLocalStorage = {
    get: (key, fn) => {
        try {
            const value = localStorage.getItem(key);
            return value; // Return the value if accessible
        } catch (e) {
            console.warn("localStorage is blocked or not accessible.", e);
            if (fn && typeof fn === 'function') {
                fn(); // Call the callback function
            }
           
            return null; // Return null if there's an error
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn("localStorage is blocked or not accessible.", e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn("localStorage is blocked or not accessible.", e);
        }
    }
}
