import axios from "axios";
//import Videoplayer from "../../components/VideoPlayer";
import { appConfig } from "@/config/config";
import { notFound } from "next/navigation";
import Videoplayer from "@/app/components/VideoPlayer";
import { creatUrlLink } from "@/utils";

async function getMovieDeatils(movieId) {

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/movies/details_movie`, {
      movie: movieId,
    });

    if (response.status !== 200) {

      return { movieData: [], status: response.status };
    };

    return { movieData: response.data.movieData, status: response.status };
  } catch (error) {
    return { movieData: [], status: 404 };
  }

};

export async function generateMetadata({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils(movieId);

  if (status !== 200) {
    return;
  }

  const movieName = movieData?.title;

  const movieThambnail = movieData?.thambnail;

  const movieType = movieData?.type;

  const genres = movieData?.genre.join(' ');

  const language = movieData?.language;

  const fromatedTitle = creatUrlLink(movieName);

  const ogUrl = `https://moviesbazaar.vercel.app/watch/${movieType}/${fromatedTitle}/${movieId}`;

  return {

    title: movieName + ' ' + movieType,
    description: `Watch ${movieName+ ' '+ movieType} online Movies Bazaar`,
    keywords: `${movieName+ ' '+ movieType}, Watch ${movieName} online, Stream ${movieName} online, Watch ${movieName+ ' '+ movieType} online, ${movieName} online streaming, ${movieName+ ' '+ movieType} watch free online, ${movieName + ' ' + movieType} streaming, Watch ${movieName} HD online, ${movieName} online watch free, ${movieName+ ' '+ movieType} stream HD, Where to watch ${movieName} online, Watch ${genres + ' ' + movieType} online, Watch ${language + ' ' + movieType} online`,

    openGraph: {
      images: movieThambnail,
      title: movieName + ' ' + movieType,
      description: `Watch ${movieName+ ' '+ movieType} online Movies Bazaar`,
      url: ogUrl
    },
  }
};

export default async function Page({ params }) {

  const movieId = params?.movieDetails ? params.movieDetails[2] : ' ';

  const { movieData, status } = await getMovieDeatils(movieId);

  if (status !== 200) {
    notFound();
  };

  return (
    <Videoplayer movieDetails={movieData} />
  )
}
