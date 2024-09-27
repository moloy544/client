
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { creatUrlLink, getMovieDeatils } from "@/utils";
import { appConfig } from "@/config/config";
import { InspectPreventer } from "@/lib/lib";
import MovieDetails from "../MovieDetails";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";
import Script from "next/script";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false });

function getIP() {

  const FALLBACK_IP_ADDRESS = '76.76.21.123'
  const forwardedFor = headers().get('x-forwarded-for');
  if (process.env.NODE_ENV === "development") {
    return FALLBACK_IP_ADDRESS;
  }

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export async function generateMetadata({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils('tt' + movieId, false);


  if (status !== 200 || movieData.status === "coming soon" || params.movieDetails.length !== 3) {
    return;
  };

  // movie all dara fields
  const { title, thambnail, releaseYear, type, genre, language, castDetails } = movieData || {}

  const paramsType = params.movieDetails[0];
  const paramsTitle = params.movieDetails[1];
  const browserUrlath = `/watch/${paramsType}/${paramsTitle}/${movieId}`;
  const createdUrlPath = `/watch/${type}/${creatUrlLink(title)}/${movieId}`;

  if (browserUrlath !== createdUrlPath) {
    return;
  }


  // extract the movie genres
  const genres = genre?.join(' ');

  // extract the movie cast names
  const movieCast = castDetails ? castDetails.join(', ') : null;

  // metadata related fields
  const metaTitle = `Watch ${title + " (" + releaseYear + ") " + type} online free`
  const metaDesc = `${title + " " + releaseYear + " " + type} watch online free. featuring lead actress ${movieCast}. Enjoy it in ${language} and this is ${genre?.join(' ')} genre based ${type}.`;
  const metaOgUrl = `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${movieId}`;
  const metaKeywords = [
    `${title} ${type}`,
    `Watch ${title} ${releaseYear} ${type}`,
    `${title} ${releaseYear} ${type}`,
    `Watch ${title} online`,
    `Stream ${title} online`,
    `Watch ${title} ${type} online`,
    `${title} online streaming`,
    `${title} ${type} watch free online`,
    `${title} ${type} streaming`,
    `Watch ${title} HD online`,
    `${title} online watch free`,
    `${title} ${type} stream HD`,
    `Where to watch ${title} online`,
    `Watch ${genres} ${type} online`,
    `Watch ${language} ${type} online`,
    ...castDetails.map(cast => `Watch ${cast} ${type}`)
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
      images: thambnail,
    },
  }

  return metaDataObject
};

export default async function Page({ params }) {

  const { movieDetails } = params;
  const movieId = movieDetails ? movieDetails[2] : null;
  const ip = getIP();

  const { status, movieData, suggestions } = await getMovieDeatils('tt' + movieId, true);
  let isValidPath = true;

  // Verify if the browser url is expted url or not
  // If not math then show not found by set validapath false and call notFound.
  if (status === 200 && movieData) {
    const type = movieDetails[0]
    const title = movieDetails[1]
    const browserUrlath = `/watch/${type}/${title}/${movieId}`;
    const createdUrlPath = `/watch/${movieData.type}/${creatUrlLink(movieData.title)}/${movieId}`;
    if (browserUrlath !== createdUrlPath || movieDetails.length !== 3) {
      isValidPath = false;
    }
  }

  if (status === 404 || !isValidPath) {
    notFound();
  } else if (status === 400 || status === 500) {
    return (
      <SomthingWrongError reportMessage={`Hello MoviesBazar Team,\n\nI am experiencing an error while exploring the content. The error occurred on the following content id: ${movieId}.\n\nThank you for your assistance!`} />
    )
  };

  return (
    <InspectPreventer>
      <NavigateBackTopNav title={`Watch ${movieData?.type}`} />
      <MovieDetails
        movieDetails={movieData}
        suggestions={suggestions}
        userIp={ip}
      />
      <Script async={true} src="/static/js/anti-adblock.js?v=1.0.1" data-cfasync="true" strategy="lazyOnload" />
      <Footer />
    </InspectPreventer>
  )
}
