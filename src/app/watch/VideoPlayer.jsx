'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import MoviesUserActionWarper from "./MoviesUserActionWarper";
import { transformToCapitalize } from "@/utils";
import Breadcrumb from "../components/Breadcrumb";
const DynamicTrailerPlayerIframe = dynamic(() => import('./PlayerIframes').then(module => module.TrailerPlayerIframe));
const DynamicVideoPlayerIframe = dynamic(() => import('./PlayerIframes').then(module => module.VideoPlayerIframe));

export default function Videoplayer({ movieDetails }) {

  const [videoPlayer, setVideoPlayer] = useState({
    isLoded: false,
    visibility: false,
  });

  const [trailerPlayer, setTrailerPlayer] = useState({
    isLoded: false,
    visibility: false,
  });

  const {
    imdbRating,
    title,
    thambnail,
    releaseYear,
    fullReleaseDate,
    genre,
    watchLink,
    castDetails,
    language,
    category,
    type,
    status
  } = movieDetails || {};

  const showPlayer = () => {

    window.location.hash = "player"

  };

  const showTrailerPlayer = () => {

    window.location.hash = "trailer"

  };

  useEffect(() => {

    const handleHashChange = () => {

      const body = document.querySelector('body');

      if (window.location.hash === "#trailer") {
        setTrailerPlayer({
          isLoaded: true,
          visibility: true,
        });
      } else if (trailerPlayer.visibility) {
        setTrailerPlayer(prev => ({
          ...prev,
          visibility: false,
        }));
      }
  
      if (window.location.hash === "#player") {
        setVideoPlayer({
          isLoaded: true,
          visibility: true,
        });
        body.setAttribute('class', 'overflow-y-hidden');
      } else if (videoPlayer.visibility) {
        setVideoPlayer(prev => ({
          ...prev,
          visibility: false,
        }));
        body.removeAttribute('class', 'overflow-y-hidden');
      }
    };
  

    // Initial check on mount
    handleHashChange();

    // Add event listener to listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  console.log(videoPlayer)

  const originalDate = new Date(fullReleaseDate);

  const formattedDate = originalDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const breadcrumbData = [
    {
      name: type,
      pathLink: type === 'series' ? `/${type}` : undefined,
    },
    {
      name: category,
      pathLink: `/browse/category/${category}`,
    }
  ];

  return (
    <>

      <Breadcrumb data={breadcrumbData} />

      <div className="w-full h-full py-6 mobile:py-2 px-2 flex justify-center items-center">

        <div className="w-fit h-fit mobile:w-full mobile:max-w-[600px] md:max-w-[700px] p-3 flex mobile:flex-col gap-5 mobile:marker:gap-0 bg-white rounded-md shadow-xl relative">


          {trailerPlayer.isLoded && (
            <DynamicTrailerPlayerIframe visibility={trailerPlayer.visibility} src="https://www.youtube.com/embed/1VhA9aITCGg?si=BpRCTTS3bqdeSMAi" />
          )}

          <div className="w-auto mobile:w-full h-auto mobile:flex mobile:justify-center">

            <div className="w-[280px] h-[350px] mobile:w-[260px] mobile:mt-2 mobile:h-[300px] border border-yellow-600 rounded-md relative overflow-hidden">

              <div className="w-full h-full overflow-hidden relative group">

                <Image
                  priority
                  className="transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
                  src={thambnail}
                  alt={title}
                  fill />

              </div>

              {status === "released" ? (
                <button type="button"
                  onClick={showPlayer}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-gray-100 w-12 h-12 pl-1 pb-0.5 flex justify-center items-center rounded-full text-3xl hover:text-4xl transition-transform duration-300 hover:scale-110">
                  <i className="bi bi-play"></i>
                </button>
              ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 w-auto h-auto py-2 px-3 text-center text-white text-sm">
                    {transformToCapitalize(status)}
                  </div>
                  <button type="button"
                    onClick={showTrailerPlayer}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-gray-100 w-auto h-auto px-4 py-1.5 rounded-sm text-sm transition-transform duration-300 hover:scale-110">
                    <i className="bi bi-youtube"></i> Trailer
                  </button>
                </>
              )}
              {imdbRating && (
                <div className="absolute top-1 right-2 w-auto h-auto bg-gray-800 text-xs font-semibold text-yellow-400 px-2 py-1 rounded-md">{imdbRating}/10</div>
              )}

            </div>

          </div>

          <div className="w-auto h-auto max-w-md py-3 flex flex-col mobile:flex-col-reverse">
            <div className="mobile:px-2.5">

              <div className="text-base text-gray-900 font-bold my-3.5">Title: <span className="text-sm text-gray-600 font-medium">{title}</span></div>
              <div className="text-base text-gray-900 font-bold my-3.5">Year: <span className="text-sm text-gray-600 font-medium">{releaseYear}</span></div>
              {fullReleaseDate && (

                <div className="text-base text-gray-900 font-bold my-3.5">
                  {status === "released" ? "Released:" : "Expeted relesed:"} <span className="text-sm text-gray-600 font-medium">{formattedDate}</span>
                </div>
              )}

              <div className="text-base text-gray-900 font-bold my-3.5">Language: <Link href={`/browse/category/${language?.replace(" ", "-")}`} className="text-sm text-gray-600 font-medium">
                {language?.charAt(0).toUpperCase() + language?.slice(1)}
                {status === "Coming Soon" && language === "hindi dubbed" && " (coming soon)"}
              </Link>
              </div>

              {castDetails?.length > 0 && (
                <>
                  <div className="w-auto h-auto flex flex-wrap gap-1 items-center my-3.5">
                    <div className="text-base text-gray-900 font-bold">Star cast: </div>
                    {castDetails?.map((cast, index) => (
                      <div key={index} className="text-gray-600 text-xs font-medium rounded-md">
                        {cast}
                        {index !== castDetails.length - 1 && ','}
                      </div>
                    ))}
                  </div>

                </>
              )}

              <div className="w-auto h-auto flex flex-wrap gap-1.5 items-center my-3.5 mt-6">
                <div className="text-base text-gray-900 font-bold">Genre: </div>
                {genre?.map((genre) => (
                  <div key={genre} className="bg-gray-100 text-gray-600 w-fit h-auto px-2 py-1 text-xs font-medium rounded-md">
                    {genre !== "N/A" ? (
                      <Link href={`/browse/genre/${genre?.toLowerCase().replace(/[' ']/g, '-')}`}>{genre}</Link>
                    ) : genre}
                  </div>
                ))}
              </div>

            </div>

            <MoviesUserActionWarper movieData={movieDetails} />

          </div>

        </div>

        {videoPlayer.isLoded && (
          <DynamicVideoPlayerIframe visibility={videoPlayer.visibility} src={watchLink} />
        )}

      </div>
    </>
  )
}
