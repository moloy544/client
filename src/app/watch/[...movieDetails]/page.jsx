
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import axios from "axios";
import { creatUrlLink, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import { InspectPreventer } from "@/lib/lib";
import MovieDetails from "../MovieDetails";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";
import { BASE_OG_IMAGE_URL } from "@/constant/assets_links";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false });

// get the user ip
const getIP = () => {

  const FALLBACK_IP_ADDRESS = '76.76.21.123'
  const forwardedFor = headers().get('x-forwarded-for');
  if (process.env.NODE_ENV === "development") {
    return FALLBACK_IP_ADDRESS;
  }

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
};

// imdbId validating  using regex pattern
const imdbIdPattern = /^tt\d{7,}$/;

// get movie detais form backend server
const getMovieDeatils = async (imdbId, suggestion = true) => {

  let status = 500; // Default status in case of an error
  let movieData = null;
  let suggestions = null
  let userIp = '76.76.21.123';

  try {

    if (!imdbId || !imdbIdPattern.test(imdbId.trim())) {
      status = 400;
      return { status, movieData, suggestions };
    };

    // get contet details form backend database
    const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/details_movie/${imdbId}`, {
      params: { suggestion }
    });

    if (response.status === 200) {
      status = response.status;
      movieData = response.data.movieData || null;
      suggestions = response.data.suggestions || null;
      userIp = response.data.userIp;
    } else {
      status = response.status
    }

  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  } finally {
    return { status, userIp , movieData, suggestions };
  }
};

// Generate metadata for content
export async function generateMetadata({ params }) {

  const { movieDetails } = params;

  // Construct IMDb ID from params, ensuring it has the 'tt' prefix
  const paramsImdbId = movieDetails[2] ? `tt${movieDetails[2]}` : null;

  // Fetch movie data based on the IMDb ID
  const { movieData, status } = await getMovieDeatils(paramsImdbId, false);

  // Early return if the API response is not valid, movie details are missing, or there's no movie data
  if (status !== 200 || movieDetails.length !== 3 || !movieData) {
    return;
  }

  // Destructure necessary fields from the movie data
  const { imdbId, title, thambnail, releaseYear, type, genre, language, castDetails } = movieData || {};

  // Convert type from params and movie data to lowercase for comparison
  const paramsType = movieDetails[0]?.toLowerCase();
  const movieType = type?.toLowerCase();

  // Validate URL path components
  const isTypeValid = paramsType && paramsType === movieType;
  const isImdbIdValid = paramsImdbId && imdbIdPattern.test(paramsImdbId) && paramsImdbId === imdbId;
  const isPathLengthValid = movieDetails.length === 3;

  // If any of the checks fail, mark the path as invalid
  if (!isPathLengthValid || !isTypeValid || !isImdbIdValid) {
    return;
  };

  // extract the movie genres and sort them max 3 
  const genres = genre?.slice(0, 3).join(', ')

  // extract the movie cast names
  const movieCast = castDetails ? castDetails.join(', ') : null;

  // metadata related fields 
  const metaTitle = `Watch ${title} (${releaseYear}) ${transformToCapitalize(type)} Online Free!`;
  const metaDesc = `${title} (${releaseYear}) ${transformToCapitalize(type)} - Watch online free! Starring ${movieCast}. Enjoy this ${genres} movie in ${language}.`;
  const metaOgUrl = `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${paramsImdbId}`;
  const metaKeywords = [
    `${title}, ${type}`,
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
      images: thambnail || BASE_OG_IMAGE_URL,
    },
  }

  return metaDataObject
};

export default async function Page({ params }) {

  const { movieDetails } = params;

  const paramsImdbId = movieDetails[2] ? `tt${movieDetails[2]}` : null;

  const { status, userIp, movieData, suggestions } = await getMovieDeatils(paramsImdbId, true);

  let isValidPath = true;

  // Verify if the browser URL is the expected URL or not
  // If not, set isValidPath to false and call notFound.
  if (status === 200 && movieData) {
    // Extract params and movie data types, converting them to lowercase
    const paramsType = movieDetails[0]?.toLowerCase() || null;
    const movieDataType = movieData.type?.toLowerCase() || null;

    const movieDataImdbId = movieData.imdbId || null;

    // Validate URL path components
    const isTypeValid = paramsType && paramsType === movieDataType;
    const isImdbIdValid = paramsImdbId && imdbIdPattern.test(paramsImdbId) && paramsImdbId === movieDataImdbId;
    const isPathLengthValid = movieDetails.length === 3;

    // If any of the checks fail, mark the path as invalid
    if (!isPathLengthValid || !isTypeValid || !isImdbIdValid) {
      isValidPath = false;
    }
  };

  // show not found if path is invalid or content is not found
  if (!isValidPath || status === 404) {
    notFound();
    // If sts is not 200 ok show error message
  } else if (status !== 200) {
    return (
      <SomthingWrongError reportMessage={`Hello MoviesBazar Team,\n\nI am experiencing an error while exploring the content. The error occurred on the following content id: ${paramsImdbId}.\n\nThank you for your assistance!`} />
    )
  };

  return (
    <div className="min-w-full min-h-screen bg-custom-dark-bg">
      <InspectPreventer>
        <NavigateBackTopNav title={`Watch ${movieData?.type}`} />
        <MovieDetails
          movieDetails={movieData}
          suggestions={suggestions}
          userIp={userIp}
        />
        <Footer />
      </InspectPreventer>
    </div>
  )
}
