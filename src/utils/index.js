import axios from "axios";

export const fetchLoadMoreMovies = async ({ methood = 'post', apiPath, limitPerPage, page }) => {

  // Create a new instance of AbortController
  const abortController = new AbortController();

  // Create a cancel token using the controller's signal
  const cancelToken = axios.CancelToken.source(abortController.signal);

  try {

    const response = await axios[methood](apiPath, {
      limit: limitPerPage,
      page,
      cancelToken: cancelToken.token
    });

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    };

    // Use a Set to filter out duplicates from the data array
    const filterResponse = [...new Set(response.data.moviesData)];

    //get end of data 
    const dataIsEnd = response.data.endOfData;

    return { filterResponse, dataIsEnd };

  } catch (error) {

    if (axios.isCancel(error)) {
      // Handle request cancellation
      console.log('Request canceled:', error.message);
      return { filterResponse: [], dataIsEnd: true };
    } else {
      // Handle other errors
      console.error('Error fetching data:', error);
      return { filterResponse: [], dataIsEnd: true };
    };

  } finally {
    abortController.abort();
  };

};

//Format movie title url
export const creatUrlLink = (title) => {

  // Remove non-alphanumeric characters and replace spaces with hyphens
  const formattedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase

  return formattedTitle;
};

//Transfrom capitalize
export const transformToCapitalize = (text) => {

  // Split the text into an array of words
  const words = text.split('-');

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with a space and return the result
  return capitalizedWords.join(' ');
};

