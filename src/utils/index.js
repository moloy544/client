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
const creatToastAlert = ({ message, visibilityTime = 8000 }) => {
  if (currentTooltip?.element) {
    document.body.removeChild(currentTooltip.element);
    clearTimeout(currentTooltip.timerId);
  }

  const toolTip = document.createElement('div');
  toolTip.classList.add('custome_toast_message', 'md:text-base');
  toolTip.innerText = transformToCapitalize(message);

  // Convert ms to seconds
  const fadeOutDelaySeconds = Math.max((visibilityTime - 500) / 1000, 0); // subtract 0.5s for slideDown duration

  // Dynamically assign animation string to match custom visibility time
  toolTip.style.animation = `slideUp 0.5s forwards, slideDown 0.5s forwards ${fadeOutDelaySeconds}s`;

  document.body.appendChild(toolTip);

  const timerId = setTimeout(() => {
    document.body.removeChild(toolTip);
    currentTooltip = null;
  }, visibilityTime);

  currentTooltip = { element: toolTip, timerId };
};


function resizeImage(src, resize = 'f_auto,q_auto') {
  let resizeParam = resize || 'f_auto,q_auto';
  if (!src) return src;

  const isTmtbImage = src.startsWith('https://image.tmdb.org');
  const isCloudinaryImage = src.startsWith('https://res.cloudinary.com');
  let img = src;
  if (isTmtbImage) {
    const resizeValue = resizeParam !== "f_auto,q_auto" ? resizeParam : 'w300';
    img = src.replace('w500', resizeValue)
  } else if (isCloudinaryImage) {
    const resizeValue = resizeParam.startsWith('w_') ? resizeParam : 'f_auto,q_auto';
    img = src.replace('/upload/', `/upload/${resizeValue}/`);
  }
  return img;
};

// Transfrom and edit actors avatar images function utiliti
function editActorsImageUrl(imageUrl, transformValue) {

 const tmdbBaseUrl = "https://image.tmdb.org/t/p/";

 if (imageUrl.startsWith(tmdbBaseUrl)) {
     // Find the part after '/t/' and ensure it doesn't have extra size transformations
     const regex = /https:\/\/image\.tmdb\.org\/t\/p\/([^\/]+)\/(.*)/;

     // Replace the existing size transformation with the new transformation value
     const updatedUrl = imageUrl.replace(regex, `https://image.tmdb.org/t/p/${transformValue}/$2`);

     return updatedUrl;
 }
 
 return imageUrl; // Return the original URL if it's not a TMDb image
}

const isMobileDevice = () => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  } else {
    // Fallback to older method
    return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
};


function isNotHuman() {

  if (typeof window === 'undefined') {
    return true;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    /bot/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /mediapartners/i,
    /adsbot/i,
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /baiduspider/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
};


/**** Export all utilities *****/
export {
  loadMoreFetch,
  creatUrlLink,
  debounceDelay,
  transformToCapitalize,
  formatNumberCounter,
  imageToBase64Url,
  creatToastAlert,
  resizeImage,
  editActorsImageUrl,
  isMobileDevice,
  isNotHuman
}