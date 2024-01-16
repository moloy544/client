import axios from "axios";

export const fetchLoadMoreMovies = async ({ methood = 'post', apiPath, limitPerPage, skip = 0 }) => {

  try {

    const response = await axios[methood](apiPath, {
      limit: limitPerPage,
      skip
    });

    const status = response.status;

    // Use a Set to filter out duplicates from the data array
    const filterResponse = [...new Set(response.data.moviesData)];

    //get end of data 
    const dataIsEnd = response.data.endOfData;

    return { status, filterResponse, dataIsEnd };

  } catch (error) {
    console.log(error);
    return { status: 500, filterResponse: [], dataIsEnd: true }
  }
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

