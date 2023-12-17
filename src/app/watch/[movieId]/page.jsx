import axios from "axios";
import Videoplayer from "../../components/VideoPlayer";
import { appConfig } from "@/config/config";
import { notFound } from "next/navigation";

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

  const movieId = params?.movieId;

  const { movieData, status } = await getMovieDeatils(movieId);

  if (status !== 200) {
    return;
  }

  const movieName = movieData?.title;

  const movieThambnail = movieData?.thambnail;

  const movieType = movieData?.type;

  const genres = movieData?.genre.join(' ');

  const language = movieData?.language;

  return {

    title: `${movieName}`,
    description: `Watch ${movieName} movie online Movies Bazaar`,
    keywords: `${movieName} movie, Watch ${movieName} online, Stream ${movieName} online, Watch ${movieName} movie online, ${movieName} online streaming, ${movieName} movie watch free online, ${movieName + ' ' + movieType} streaming, Watch ${movieName} HD online, ${movieName} online watch free, ${movieName} movie stream HD, Where to watch ${movieName} online, Watch ${genres + ' ' + movieType} online, Watch ${language + ' ' + movieType} online`,

    openGraph: {
      images: movieThambnail,
      title: `${movieName} movies`,
      description: `Watch ${movieName} movie online Movies Bazaar`,
      url: `https://moviesbazaar.vercel.app/watch/${movieId}`
    },
  }
};

export default async function Page({ params }) {

  const movieId = params?.movieId;

  const { movieData, status } = await getMovieDeatils(movieId);

  if (status !== 200) {
    notFound();
  };

  const videoSource = movieData?.watchLink;

  return (
    <div className="flex justify-center mt-24 mobile:mt-32 mb-10 w-full h-full px-20">

      <Videoplayer videoSource={videoSource} />

    </div>
  )
}
