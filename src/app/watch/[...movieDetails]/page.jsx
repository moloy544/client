
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { creatUrlLink, getMovieDeatils } from "@/utils";
import { appConfig } from "@/config/config";
import { InspectPreventer } from "@/lib/lib";
import MovieDetails from "../MovieDetails";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export async function generateMetadata({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils('tt' + movieId);

  if (status !== 200 || movieData.status === "coming soon") {
    return;
  };

  // movie all dara fields
  const { title, thambnail, releaseYear, type, genre, language, castDetails } = movieData || {}

  // extract the movie genres
  const genres = genre?.join(' ');

  // extract the movie cast names
  const movieCast = castDetails ? castDetails.join(', ') : null;

  // metadata related fields
  const metaTitle = `${title + " ("+ releaseYear + ") " + type}`
  const metaDesc = `Watch ${title + " " + releaseYear + " " + type} featuring lead actress ${movieCast} online for free only on Movies Bazaar. Enjoy it in ${language} and this is ${genre?.join(' ')} genre based ${type}.`;
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

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { status, movieData, suggetions } = await getMovieDeatils('tt' + movieId);

  if (status === 404) {
    notFound();
  } else if (status === 400 || status === 500) {
    return (
      <SomthingWrongError />
    )
  };

  return (
    <InspectPreventer>
      <NavigateBackTopNav title={`Watch ${movieData?.type}`} />
      <MovieDetails movieDetails={movieData} suggestions={suggetions} />
    </InspectPreventer>
  )
}
