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
async function getMovieDeatils(imdbId) {

  let status = 500; // Default status in case of an error
  let movieData = null;
  let suggetions = null

  try {
    const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/details_movie/${imdbId}`);
    if (response.status === 200) {
      status = response.status;
      movieData = response.data.movieData;
      suggetions = response.data.suggetions;
    }else{
      status = response.status
    }
   
  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  } finally {
    return { status, movieData, suggetions };
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

/*************** Transfrom capitalize **************/
const transformToCapitalize = (text) => {

  // Split the text into an array of words
  const words = text?.split('-');

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words?.map(word => {
    return word?.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with a space and return the result
  return capitalizedWords?.join(' ');
};

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

/**** Export all utilities *****/
export {
  loadMoreFetch,
  getMovieDeatils,
  creatUrlLink,
  transformToCapitalize,
  formatNumberCounter,
  imageToBase64Url,
}