import { appConfig } from "@/config/config";
import axios from "axios";

/************** Load more movies data function for handle infinity loading ************/
const loadMoreFetch = async ({ methood = 'post', apiPath, limitPerPage = 20, page = 1, skip = 0, bodyData }) => {

  let status = 500;
  let data = [];
  let dataIsEnd = true;

  try {

    const { signal } = new AbortController();

    const api = axios.create({
      baseURL: apiPath,
      signal
    });

    const response = await api[methood]('', {
      limit: limitPerPage,
      page,
      skip,
      bodyData,
    });

    status = response.status;
    data = response.data
    dataIsEnd = response.data.endOfData;

  } catch (error) {
    console.log(error);
    if (error.response) {
      status = error.response.status
    }
  }

  return { status, data, dataIsEnd };
};

/**************** Get movie serirs details from database ***************/
async function getMovieDeatils(imdbId, suggestion = true) {

  let status = 500; // Default status in case of an error
  let movieData = null;
  let suggestions = null

  try {

    if (!imdbId || imdbId === ' ' || imdbId === '' || imdbId.length <= 6) {
      return { status, movieData, suggestions };
    }
    const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/details_movie/${imdbId}`, {
      params: { suggestion }
    });

    if (response.status === 200) {
      status = response.status;
      movieData = response.data.movieData || null;
      suggestions = response.data.suggestions || null;
    } else {
      status = response.status
    }

  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  } finally {
    return { status, movieData, suggestions };
  }
};

/*************** Format movie title url ***************/
const creatUrlLink = (title) => {

  // Remove non-alphanumeric characters and replace spaces with hyphens
  const formattedTitle = title?.replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase

  return formattedTitle;
};


// **** Debounce function for delay ****//
const debounceDelay = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/*************** Transfrom capitalize **************/
const transformToCapitalize = (text) => {

  return text
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/-/g, ' ') // Replace hyphens with spaces globally
    .split(' ')    // Split the string by spaces to get individual words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ');    // Join the words back into a single string
}


/**************** format numbers to compact like 1K 50k ****************/
const formatNumberCounter = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 2,
  notation: 'compact',
}).format(value);

/******************* Function to convert image to base64 *****************/
const imageToBase64Url = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// ******** Creat Toast Message Alert In Dom For Temporarily *******/
//Creat Tooltip Popup Messages 
let currentTooltip = null;
const creatToastAlert = ({ message, visiblityTime = 8000 }) => {
  // If there's already a tooltip displayed, remove it before showing the new one
  if (currentTooltip && currentTooltip.element) {
    document.body.removeChild(currentTooltip.element);
    clearTimeout(currentTooltip.timerId);
  }

  // Create a div element for the tooltip
  const toolTip = document.createElement('div');

  toolTip.classList.add('custome_toast_message', 'md:text-base');

  // Set inner text (or inner HTML if needed)
  toolTip.innerText = transformToCapitalize(message);

  // Append the created element to the DOM, assuming you want to add it to the body
  document.body.appendChild(toolTip);

  // Remove the tooltip after the specified visibility time
  const timerId = setTimeout(() => {
    document.body.removeChild(toolTip);
    // Clear the reference to the tooltip
    currentTooltip = null;
  }, visiblityTime);

  // Update the currentTooltip and store the DOM element and timerId
  currentTooltip = { element: toolTip, timerId };
};

function resizeImage(src, resize = 'f_auto,q_auto') {
  let resizeParam = resize || 'f_auto,q_auto';
  if (!src) return src;

  const isTmtbImage = src.startsWith('https://image.tmdb.org');
  const isCloudinaryImage = src.startsWith('https://res.cloudinary.com');
  let img = src;
  if (isTmtbImage) {
    img = src.replace('w500', 'w300')
  } else if (isCloudinaryImage) {
    img = src.replace('/upload/', `/upload/${resizeParam}/`);
  }
  return img;
}

/**** Export all utilities *****/
export {
  loadMoreFetch,
  getMovieDeatils,
  creatUrlLink,
  debounceDelay,
  transformToCapitalize,
  formatNumberCounter,
  imageToBase64Url,
  creatToastAlert,
  resizeImage
}