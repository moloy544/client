
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
//import { headers } from "next/headers";
import axios from "axios";
import { creatUrlLink, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import { InspectPreventer } from "@/lib/lib";
import MovieDetailsComponents from "../MovieDetailsComponent";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";
import { BASE_OG_IMAGE_URL } from "@/constant/assets_links";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false });

/**function getClientIp() {

    const requestHeaders = headers();
    const xRealIp = requestHeaders.get('x-real-ip');
    const xForwardedFor = requestHeaders.get('x-forwarded-for');

    return (
        xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
        '0.0.0.0');

};**/

// imdbId validating  using regex pattern
const imdbIdPattern = /^tt\d{7,}$/;

// get movie detais form backend server
const getMovieDeatils = async (imdbId, suggestion = true) => {

  let status = 500; // Default status in case of an error
  let movieData = null;
  let suggestions = null
  let userIp = null;

  try {

    if (!imdbId || !imdbIdPattern.test(imdbId.trim())) {
      status = 400;
      return { status, movieData, suggestions };
    };

    const ip = '0.0.0.0';

    // get contet details form backend database
    const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/details_movie/v2/${imdbId}`, {
      params: { suggestion, ip }
    });

    if (response.status === 200) {
      status = response.status;
      movieData = response.data.movieData || null;
      suggestions = response.data.suggestions || null;
      userIp = null //userIp || response.data.userIp;
    } else {
      status = response.status
    }

  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  } finally {
    return { status, userIp, movieData, suggestions };
  }
};

// Generate metadata for content
export async function generateMetadata({ params }) {

  const { pathDetails } = params;

  // Construct IMDb ID from params, ensuring it has the 'tt' prefix
  const paramsImdbId = pathDetails[2] ? `tt${pathDetails[2]}` : null;

  // Fetch movie data based on the IMDb ID
  const { movieData, status } = await getMovieDeatils(paramsImdbId, false);

  // Early return if the API response is not valid, movie details are missing, or there's no movie data
  if (status !== 200 || pathDetails.length !== 3 || !movieData) {
    return;
  }

  // Destructure necessary fields from the movie data
  const { imdbId, title, thumbnail, releaseYear, type, genre, language, category, castDetails, multiAudio } = movieData || {};

  // Convert type from params and movie data to lowercase for comparison
  const paramsType = pathDetails[0]?.toLowerCase();
  const movieType = type?.toLowerCase();

  // Validate URL path components
  const isTypeValid = paramsType && paramsType === movieType;
  const isImdbIdValid = paramsImdbId && imdbIdPattern.test(paramsImdbId) && paramsImdbId === imdbId;
  const isPathLengthValid = pathDetails.length === 3;

  // If any of the checks fail, mark the path as invalid
  if (!isPathLengthValid || !isTypeValid || !isImdbIdValid) {
    return;
  };

  // extract the movie genres and sort them max 3 
  const genres = genre?.slice(0, 3).join(', ')

  // extract the movie cast names
  const movieCast = castDetails
    ? castDetails.length > 1
      ? `${castDetails.slice(0, -1).join(', ')} and ${castDetails[castDetails.length - 1]}`
      : castDetails[0] // If only one cast member, just show that
    : null;

  // metadata related fields 
  const metaTitle = `Watch ${title} (${releaseYear}) ${transformToCapitalize(type)} Online Free!`;
  const metaDesc = `${title} (${releaseYear}) ${transformToCapitalize(type)} - Watch online free! Starring ${movieCast}. Enjoy this ${genres} ${type} ${category !== 'bollywood' && multiAudio ? `in ${language}${category === 'hollywood' && language !== 'english' ? `, english and other languages` : multiAudio && language !== 'hindi dubbed' ? ", hindi dubbed and other languages" : " and other languages"}` : multiAudio ? `in ${language} and other languages` : category === 'bollywood' ? multiAudio ? `in ${language} and multiple languages` : `in ${language}` : ''}`.trimEnd();
  const metaOgUrl = `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${paramsImdbId?.replace('tt', '')}`;
  const metaKeywords = [
    `${title + " " + type}`,
    `Watch ${title} (${releaseYear}) ${type} online free`,
    `Watch ${title} (${releaseYear}) ${type} online free`,
    `${title} ${type} full movie`,
    `${title} ${type} full movie watch online free`,
    `Stream ${title} ${type} in HD`,
    `Watch ${title} ${type} streaming free`,
    `Watch ${title} ${type} online HD`,
    `Where to watch ${title} online`,
    ...castDetails.slice(0, 4).map(cast => `Watch movies featuring ${cast}`) // More engaging phrasing
  ].join(', ');

  // meta data for this movie or series page
  const metaDataObject = {
    title: metaTitle,
    description: metaDesc,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: metaOgUrl,
      images: thumbnail || BASE_OG_IMAGE_URL,
    },
    alternates: {
      canonical: `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${paramsImdbId?.replace('tt', '')}`
    },
  }

  return metaDataObject
};

export default async function Page({ params }) {

  const { pathDetails } = params;

  const paramsImdbId = pathDetails[2] ? `tt${pathDetails[2]}` : null;

  const { status, userIp, movieData, suggestions } = await getMovieDeatils(paramsImdbId, true);


  let isValidPath = true;

  // Verify if the browser URL is the expected URL or not
  // If not, set isValidPath to false and call notFound.
  if (status === 200 && movieData) {
    // Extract params and movie data types, converting them to lowercase
    const paramsType = pathDetails[0]?.toLowerCase() || null;
    const movieDataType = movieData.type?.toLowerCase() || null;

    const movieDataImdbId = movieData.imdbId || null;

    //const validatePath = movieData.validatePath || null;

    // Validate URL path components
    const isTypeValid = paramsType && paramsType === movieDataType;
    const isImdbIdValid = paramsImdbId && imdbIdPattern.test(paramsImdbId) && paramsImdbId === movieDataImdbId;
    const isPathLengthValid = pathDetails.length === 3;

    const preventValidation = movieData.hasOwnProperty("validatePath") && movieData.validatePath === false;

    if (!preventValidation) {
      if (
        !isPathLengthValid ||
        !isTypeValid ||
        !isImdbIdValid
      ) {
        isValidPath = false;
      }
    }

  };

  // show not found if path is invalid or content is not found
  if (!isValidPath || status === 404) {
    notFound();
    // If sts is not 200 ok show error message
  } else if (status !== 200) {
    return (
      <SomthingWrongError />
    )
  };

  return (

    <div className="min-w-full min-h-screen bg-custom-dark-bg">
      <InspectPreventer>
        <NavigateBackTopNav title={`Watch ${movieData?.type}`} />
        <MovieDetailsComponents
          movieDetails={movieData}
          suggestions={suggestions}
          userIp={userIp}
        />

        <Footer />
      </InspectPreventer>
    </div>
  )
}
