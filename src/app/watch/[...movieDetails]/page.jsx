import Videoplayer from "@/app/watch/VideoPlayer";
import { creatUrlLink, getMovieDeatils } from "@/utils";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SomthingWrongError from "@/app/components/errors/SomthingWrongError";

export async function generateMetadata({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils('tt' + movieId);

  if (status !== 200) {
    return;
  }

  const { title, thambnail, type, genre, language } = movieData || {}

  const genres = genre?.join(' ');

  const fromatedTitle = creatUrlLink(title);

  const ogUrl = `https://moviesbazaar.vercel.app/watch/${type}/${fromatedTitle}/${movieId}`;

  return {

    title: title + ' ' + type,
    description: `Watch ${title + ' ' + type} online Movies Bazaar for free with also available ${language} language`,
    keywords: `${title + ' ' + type}, Watch ${title} online, Stream ${title} online, Watch ${title + ' ' + type} online, ${title} online streaming, ${title + ' ' + type} watch free online, ${title + ' ' + type} streaming, Watch ${title} HD online, ${title} online watch free, ${title + ' ' + type} stream HD, Where to watch ${title} online, Watch ${genres + ' ' + type} online, Watch ${language + ' ' + type} online`,

    openGraph: {
      images: thambnail,
      title: title + ' ' + type,
      description: `Watch ${title + ' ' + type} online Movies Bazaar for free with also available ${language} language`,
      url: ogUrl
    },
  }
};

export default async function Page({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { status, movieData } = await getMovieDeatils('tt' + movieId);

  if (status !== 200) {
    return (
      <SomthingWrongError />
    )
  };

  return (
    <>
      <NavigateBackTopNav title={`Watch ${movieData?.type}`} />

      <Videoplayer movieDetails={movieData} />
    </>
  )
}
