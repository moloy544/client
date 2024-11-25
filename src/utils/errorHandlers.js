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
};

// Function to safely access sessionStorage
export const safeSessionStorage = {
    get: (key, fn) => {
        try {
            const value = sessionStorage.getItem(key);
            return value; // Return the value if accessible
        } catch (e) {
            console.warn("sessionStorage is blocked or not accessible.", e);
            if (fn && typeof fn === 'function') {
                fn(); // Call the callback function
            }
           
            return null; // Return null if there's an error
        }
    },
    set: (key, value) => {
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            console.warn("sessionStorage is blocked or not accessible.", e);
        }
    },
    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.warn("sessionStorage is blocked or not accessible.", e);
        }
    }
}

