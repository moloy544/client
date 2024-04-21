import { appConfig } from "@/config/config";
import axios from "axios";

export const loadMoreFetch = async ({ methood = 'post', apiPath, limitPerPage = 20, page = 1, skip = 0, bodyData }) => {

  let status = 500;
  let data = [];
  let dataIsEnd = true;

  try {

    const response = await axios[methood](apiPath, {
      limit: limitPerPage,
      page,
      skip,
      bodyData
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

//Get movie serirs details from database
export async function getMovieDeatils(imdbId) {

  let status = 500; // Default status in case of an error
  let movieData = null;

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/movies/details_movie/${imdbId}`);
    status = response.status;
    movieData = response.data.movieData;
  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  } finally {
    return { status, movieData };
  }
};

//Format movie title url
export const creatUrlLink = (title) => {

  // Remove non-alphanumeric characters and replace spaces with hyphens
  const formattedTitle = title?.replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase

  return formattedTitle;
};

//Transfrom capitalize
export const transformToCapitalize = (text) => {

  // Split the text into an array of words
  const words = text?.split('-');

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words?.map(word => {
    return word?.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with a space and return the result
  return capitalizedWords?.join(' ');
};


export const formatNumberCounter = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 2,
  notation: 'compact',
}).format(value);
