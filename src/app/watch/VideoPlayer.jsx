'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MoviesUserActionWarper from "./MoviesUserActionWarper";
import { transformToCapitalize } from "@/utils";
import Breadcrumb from "../components/Breadcrumb";
import SliderMoviesShowcase from "../components/SliderMoviesShowcase";

export default function Videoplayer({ movieDetails, suggestions }) {

  const iframeRef = useRef(null);

  const [playerVisibility, setPlayerVisibility] = useState(false);

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
    window.location.hash = "play"
  };

  useEffect(() => {

    setPlayerVisibility(true);

    const handleHashChange = () => {
      const body = document.querySelector('body');
      const playerIframe = iframeRef.current;

      if (window.location.hash === "#play" && !playerVisibility) {
        setPlayerVisibility(true);
      };

      if (window.location.hash === "#play" && playerIframe) {
        playerIframe.style.display = "block";
        body.setAttribute('class', 'overflow-y-hidden');
      } else if (playerIframe) {
        playerIframe.style.display = "none";
        body.removeAttribute('class', 'overflow-y-hidden');
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [playerVisibility]);

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

        <div className="w-fit h-fit mobile:w-full mobile:max-w-[600px] md:min-w-[700px] md:max-w-[800px] p-3 flex mobile:flex-col gap-5 mobile:marker:gap-0 bg-white rounded-md shadow-xl">

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
                <span className="sr-only">Play video</span>
                </button>
              ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 w-auto h-auto py-2 px-3 text-center text-white text-sm">
                    {transformToCapitalize(status)}
                  </div>
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
                  <div className="w-auto h-auto flex flex-wrap gap-1 items-center my-3.5 md:mr-3">
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

        {playerVisibility && (
          <iframe
            ref={iframeRef}
            className="fixed top-0 left-0 w-full h-full border-none z-[300] hidden"
            src={watchLink}
            allowFullScreen="allowfullscreen" />
        )}

      </div>
      {/**** Show Suggest Data Based on Gnere ******/}
      <SliderMoviesShowcase moviesData={suggestions?.genreList} title="You might also like" />
      {/**** Show Suggest Data Based on Cast ******/}
      <SliderMoviesShowcase moviesData={suggestions?.castList} title="From same actors" />
    </>
  )
}
