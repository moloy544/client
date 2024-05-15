
import { notFound } from "next/navigation";
import { creatUrlLink, getMovieDeatils } from "@/utils";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SomthingWrongError from "@/app/components/errors/SomthingWrongError";
import Videoplayer from "@/app/watch/VideoPlayer";
import { InspectPreventer } from "@/lib/inspectPreventer";

export async function generateMetadata({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils('tt' + movieId);

  if (status !== 200 || movieData.status === "coming soon") {
    return;
  };

  const { title, thambnail, releaseYear, type, genre, language } = movieData || {}

  const genres = genre?.join(' ');

  const ogUrl = `https://moviesbazar.online/watch/${type}/${creatUrlLink(title)}/${movieId}`;

  return {

    title: title + ' ' + '(' + releaseYear + ')' + ' ' + ' ' + type,
    description: `Watch ${title} ${releaseYear}  ${type} online only on Movies Bazaar for free with ${language}`,
    keywords: `${title + ' ' + type}, Watch ${title + ' ' + releaseYear + ' ' + type}, ${title + ' ' + releaseYear + ' ' + type}, Watch ${title} online, Stream ${title} online, Watch ${title + ' ' + type} online, ${title} online streaming, ${title + ' ' + type} watch free online, ${title + ' ' + type} streaming, Watch ${title} HD online, ${title} online watch free, ${title + ' ' + type} stream HD, Where to watch ${title} online, Watch ${genres + ' ' + type} online, Watch ${language + ' ' + type} online`,

    openGraph: {
      images: thambnail,
      title: title + ' ' + '(' + releaseYear + ')' + ' ' + type,
      description: `Watch ${title} ${releaseYear}  ${type} online only on Movies Bazaar for free with ${language}`,
      url: ogUrl
    },
  }
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
    <>
      <NavigateBackTopNav title={`Watch ${movieData?.type}`} />
      <InspectPreventer>
      <Videoplayer movieDetails={movieData} suggestions={suggetions} />
      </InspectPreventer>
    </>
  )
}
