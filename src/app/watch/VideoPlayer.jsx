'use client'

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MoviesUserActionWarper from "./MoviesUserActionWarper";
import { transformToCapitalize } from "@/utils";

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

  return (
    <>

      <div aria-label="Breadcrumb" className="bg-gray-800 px-3 py-2">
        <div className="flex items-center text-base mobile:text-sm text-gray-300">
          <div>
            <Link href="/" className="block transition hover:text-cyan-500">
              <span className="sr-only"> Home </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mobile:h-4 mobile:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>

          <div className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div>

            {type === "series" ? (
              <Link href={`/${type}`} className="block transition hover:text-cyan-500">{type}</Link>
            ) : (
              <span className="block transition hover:text-cyan-500">{type}</span>
            )}

          </div>

          <div className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div>
            <Link href={`/movies/category/${category}`} className="block transition hover:text-cyan-500">{category}</Link>
          </div>

          <div className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div>
            <Link href={`/movies/category/${language?.replace(' ', '-')}`} className="block transition hover:text-cyan-500">{language}</Link>
          </div>
        </div>
      </div>

      <div className="w-full h-full py-6 mobile:py-2 px-2 flex justify-center items-center">

        <div className="mobile:w-full mobile:max-w-[600px] md:min-w-[700px] w-fit h-fit p-3 flex mobile:flex-col gap-5 mobile:marker:gap-0 bg-white rounded-md shadow-xl">

          <div className="w-auto mobile:w-full h-auto mobile:flex mobile:justify-center">

            <div className="w-[280px] h-[350px] mobile:w-[260px] mobile:mt-2 mobile:h-[300px] border border-gray-600 rounded-md relative overflow-hidden">

              <div className="w-full h-full overflow-hidden relative group">

                <Image
                  className="transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
                  src={thambnail}
                  alt={title}
                  fill />

              </div>

              {status === "released" ? (<div role="button" onClick={showPlayer}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-gray-100 w-12 h-12 flex justify-center items-center rounded-full pl-1 text-3xl hover:text-4xl transition-transform duration-300 hover:scale-110">
                <i className="bi bi-play"></i>
              </div>) : (
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

              <div className="text-base text-gray-900 font-bold my-3.5">Title: <span className="text-sm text-gray-600 font-semibold">{title}</span></div>
              <div className="text-base text-gray-900 font-bold my-3.5">Year: <span className="text-sm text-gray-600 font-semibold">{releaseYear}</span></div>
              {fullReleaseDate && (

                <div className="text-base text-gray-900 font-bold my-3.5">
                  {status === "released" ? "Released:" : "Expeted relesed:"} <span className="text-sm text-gray-600 font-semibold">{formattedDate}</span>
                </div>
              )}

              <div className="text-base text-gray-900 font-bold my-3.5">Language: <Link href={`/movies/category/${language?.replace(" ", "-")}`} className="text-sm text-gray-600 font-semibold">
                {language?.charAt(0).toUpperCase() + language?.slice(1)}
                {status === "Coming Soon" && language === "hindi dubbed" && " (coming soon)" }
                </Link>
                </div>

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
