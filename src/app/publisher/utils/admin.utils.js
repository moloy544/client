// Get today's date in yyyy-mm-dd format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const validateMovieDetailsInput = (data) => {
    if (typeof data !== 'object' || data === null) {
        return "Invalid movie details";
    }

    if (!data.imdbId || data.imdbId.length <= 6) {
        return "Imdb Id must be at least 6 characters"
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        return "Title is required";
    }

    if (!data.releaseYear || typeof data.releaseYear !== 'number' || data.releaseYear <= 0) {
        return "Release Year is required and must be a positive number";
    }

    if (!data.fullReleaseDate || typeof data.fullReleaseDate !== 'string' || data.fullReleaseDate.trim() === '') {
        return "Full Release Date is required ";
    }

    if (!data.category || data.category.trim() === '') {
        return "Category is required";
    }

    if (typeof data.imdbRating !== 'number' || data.imdbRating > 10) {
        return "IMDB Rating is required and must be a number between 0 and 10";
    }

    if (!data.watchLink || !Array.isArray(data.watchLink) || data.watchLink.length === 0) {
        return "Video sources is required and must be a non-empty array";
    };

    return null;
};

const isValidImageUrl = (value) => {
    // Check if value is not empty or just whitespace
    if (value.trim() === "") {
        return false; // Invalid if empty or just whitespace
    }

    // Regular expression to check for valid image URLs
    const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/i;

    // Validate the URL
    return imageUrlPattern.test(value);
};


export {
    getTodayDate,
    validateMovieDetailsInput,
    isValidImageUrl
}
