'use client'

import { useEffect, useRef } from "react";
import CategoryGroupSlider from "../components/CategoryGroupSlider";
import MoviesUserActionWarper from "./MoviesUserActionWarper";
import Link from "next/link";

export default function Videoplayer({ movieDetails }) {

  const playerRef = useRef(null);

  const {
    imdbRating,
    title,
    thambnail,
    releaseYear,
    fullReleaseDate,
    genre,
    watchLink,
    castDetails,
    language
  } = movieDetails || {};

  const showPlayer = () => {

    window.location.hash = "player"

  };

  useEffect(() => {
    const handleHashChange = () => {

      const playerElement = playerRef.current;

      if (window.location.hash === "#player") {

        playerElement.classList.add('block');
        playerElement.classList.remove('hidden');
      } else {
        playerElement.classList.remove('block');
        playerElement.classList.add('hidden');
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

  const usersReactionData = {
    initialDislike: false,
    initialLike: false,
    initialIsUser: true,
    totalLike: 120,
    totalDislike: 24
  };

  const originalDate = new Date(fullReleaseDate);

  const formattedDate = originalDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <CategoryGroupSlider />

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 px-2 flex justify-center items-center">

        <div className="mobile:w-full mobile:max-w-[600px] w-fit h-fit p-3 flex mobile:flex-col gap-5 mobile:marker:gap-0 bg-white rounded-md shadow-xl">

          <div className="w-auto mobile:w-full h-auto mobile:flex mobile:justify-center">

            <div className="w-[280px] h-[350px] mobile:w-[260px] mobile:mt-2 mobile:h-[300px] border border-gray-600 rounded-md relative overflow-hidden">

              <ZoomImage thumbnail={thambnail} title={thambnail} />

              <div role="button" onClick={showPlayer}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-gray-100 w-12 h-12 flex justify-center items-center rounded-full pl-0.5 transition-transform duration-300 hover:scale-110">
                <i className="bi bi-play text-3xl"></i>
              </div>
              {imdbRating && (
                <div className="absolute top-1 right-2 w-auto h-auto bg-gray-800 text-xs text-yellow-400 px-2 py-1 rounded-md">{imdbRating}/10</div>
              )}

            </div>

          </div>

          <div className="w-auto h-auto max-w-md py-3 flex flex-col mobile:flex-col-reverse">
            <div className="mobile:px-2.5">

              <div className="text-base text-gray-900 font-bold my-3.5">Title: <span className="text-sm text-gray-600 font-semibold">{title}</span></div>
              <div className="text-base text-gray-900 font-bold my-3.5">Year: <span className="text-sm text-gray-600 font-semibold">{releaseYear}</span></div>
              {fullReleaseDate && (
                <div className="text-base text-gray-900 font-bold my-3.5">Released: <span className="text-sm text-gray-600 font-semibold">{formattedDate}</span></div>
              )}

              <div className="text-base text-gray-900 font-bold my-3.5">Language: <span className="text-sm text-gray-600 font-semibold">{language?.charAt(0).toUpperCase() + language?.slice(1)}</span></div>

              {castDetails?.length > 0 && (
                <>
                  <div className="w-auto h-auto flex flex-wrap gap-1 items-center my-3.5">
                    <div className="text-base text-gray-900 font-bold">Star cast: </div>
                    {castDetails?.map((cast, index) => (
                      <div key={index} className="text-gray-600 text-xs font-semibold rounded-md">
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
                    <div key={genre} className="bg-cyan-100 text-gray-600 w-fit h-auto px-2 py-1 text-xs font-semibold rounded-md">
                      {genre !=="N/A" ?(
                      <Link href={`/movies/genre/${genre?.toLowerCase().replace(/[' ']/g, '-')}`}>{genre}</Link>
                      ): genre}
                    </div>
                  ))}
                </div>

            </div>


            <MoviesUserActionWarper
              usersReactionData={usersReactionData}
              movieData={movieDetails}
            />

          </div>

        </div>

        <iframe ref={playerRef} className="absolute top-0 left-0 w-full h-full border-none z-[600] hidden" src={watchLink} allowFullScreen="allowfullscreen">
        </iframe>

      </div>
    </>
  )
}


const ZoomImage = ({ thumbnail, title }) => {
  return (
    <div className="w-full h-full overflow-hidden relative group">
      <img
        className="w-full h-full object-fill transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
        src={thumbnail}
        alt={title}
      />
    </div>
  );
};

