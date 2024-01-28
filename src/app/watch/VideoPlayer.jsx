'use client'

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MoviesUserActionWarper from "./MoviesUserActionWarper";
import { transformToCapitalize } from "@/utils";
import Breadcrumb from "../components/Breadcrumb";

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
    language,
    category,
    type,
    status
  } = movieDetails || {};

  const showPlayer = () => {

    window.location.hash = "player"

  };

  useEffect(() => {

    const handleHashChange = () => {

      const playerElement = playerRef.current;

      const body = document.querySelector('body');

      if (window.location.hash === "#player") {

        playerElement.classList.add('block');
        playerElement.classList.remove('hidden');
        body.setAttribute('class', 'overflow-y-hidden');

      } else {

        playerElement.classList.remove('block');
        playerElement.classList.add('hidden');
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
      pathLink: `/movies/category/${category}`,
    },
    {
      name: language,
      pathLink: `/movies/category/${language?.replace(' ', '-')}`,
    }
  ];

  return (
    <>

      <Breadcrumb data={breadcrumbData} />

      <div className="w-full h-full py-6 mobile:py-2 px-2 flex justify-center items-center">

        <div className="mobile:w-full mobile:max-w-[600px] md:min-w-[700px] w-fit h-fit p-3 flex mobile:flex-col gap-5 mobile:marker:gap-0 bg-white rounded-md shadow-xl">

          <div className="w-auto mobile:w-full h-auto mobile:flex mobile:justify-center">

            <div className="w-[280px] h-[350px] mobile:w-[260px] mobile:mt-2 mobile:h-[300px] border border-yellow-600 rounded-md relative overflow-hidden">

              <div className="w-full h-full overflow-hidden relative group">

                <Image
                  className="transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
                  src={thambnail}
                  alt={title}
                  fill />

              </div>

              {status === "released" ? (
                <button type="button"
                  onClick={showPlayer}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-gray-100 w-12 h-12 flex justify-center items-center rounded-full text-3xl hover:text-4xl transition-transform duration-300 hover:scale-110">
                  <i className="bi bi-play"></i>
                </button>
              ) : (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 w-auto h-auto py-2 px-3 text-center text-white text-sm">
                  {transformToCapitalize(status)}
                </div>
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

              <div className="text-base text-gray-900 font-bold my-3.5">Language: <Link href={`/movies/category/${language?.replace(" ", "-")}`} className="text-sm text-gray-600 font-medium">
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
                  <div key={genre} className="bg-cyan-100 text-gray-600 w-fit h-auto px-2 py-1 text-xs font-medium rounded-md">
                    {genre !== "N/A" ? (
                      <Link href={`/movies/genre/${genre?.toLowerCase().replace(/[' ']/g, '-')}`}>{genre}</Link>
                    ) : genre}
                  </div>
                ))}
              </div>

            </div>

            <MoviesUserActionWarper movieData={movieDetails} />

          </div>

        </div>

        <iframe ref={playerRef}
          className="fixed top-0 left-0 w-full h-full border-none z-[600] hidden"
          src={watchLink}
          allowFullScreen="allowfullscreen" />

      </div>
    </>
  )
}
