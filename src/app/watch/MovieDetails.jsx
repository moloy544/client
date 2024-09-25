'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { transformToCapitalize } from "@/utils";
import MoviesUserActionOptions from "./MoviesUserActionOptions";
import Breadcrumb from "@/components/Breadcrumb";
import SliderShowcase from "@/components/SliderShowcase";
import { ModelsController } from "@/lib/EventsHandler";
import VidStackPlayer from "@/components/HlsPlayer";
import AdsterraAds from "@/components/ads/AdsterraAds";
import { adsConfig } from "@/config/ads.config";

export default function MovieDetails({ movieDetails, suggestions, userIp }) {

  const {
    imdbRating,
    title,
    thambnail,
    releaseYear,
    fullReleaseDate,
    genre,
    castDetails,
    language,
    category,
    type,
    status,
    watchLink
  } = movieDetails || {};

  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [videoSource, setVideoSource] = useState(null);

  const handleVideoSourcePlay = (source) => {

    // Set the video source as usual
    setVideoSource(source);
    
    //window.open(adsConfig.direct_Link, '_blank', 'noopener,noreferrer'); // Open the ad link

    // Ensure the video hash in the URL is updated to 'play'
    if (window.location.hash !== 'play') {
      window.location.hash = 'play';
    }
  };

  useEffect(() => {

    window.location.hash = "";

    const handleHashChange = () => {

      if (window.location.hash === "#play") {

        setPlayerVisibility(true);

      } else {
        setPlayerVisibility(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

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
      name: type === 'movie' ? type.replace('movie', 'movies') : type,
      pathLink: type === 'series' ? `/${type}` : `/browse/category/${type.replace('movie', 'movies')}`,
    },
    {
      name: category,
      pathLink: `/browse/category/${category}`,
    }
  ];

  return (
    <div className="w-full h-full bg-gray-800">

      <Breadcrumb data={breadcrumbData} />

      <AdsterraAds nativeBannerAd={false} adOptions={adsConfig.adOptions2} />

      <div data-banner-id="1415706"></div>

      <div className="my-6 mobile:my-2.5 px-2 flex justify-center items-center">

        <div className="w-fit h-fit mobile:w-full md:min-w-[700px] lg:min-w-[950px] p-2.5 md:p-6 flex mobile:flex-col items-center gap-8 mobile:gap-0 mobile:marker:gap-0 bg-[#2d3546] rounded-md shadow-xl">
          <div className={`mobile:w-full md:min-w-[400px] lg:min-w-[600px] max-w-[600px] min-h-full mx-auto ${playerVisibility && videoSource ? "block" : "hidden"}`}>

            {playerVisibility && videoSource && videoSource?.includes('.m3u8') && (
              <VidStackPlayer
                title={title}
                source={videoSource}
                userIp={userIp}
              />
            )}
            {videoSource && !videoSource?.includes('.m3u8') && (
              <iframe
                src={videoSource}
                allowFullScreen="allowfullscreen" />
            )}

          </div>

          <div className={`w-full max-w-[300px] max-h-[400px] ${playerVisibility && videoSource ? "hidden" : 'block'} aspect-[2.4/3] flex-shrink mobile:mt-2 relative overflow-hidden rounded-md border border-gray-500 bg-gray-800`}>

            <Image
              priority
              className="transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
              src={thambnail}
              alt={title}
              fill />

            {status === "released" ? (
              <PlayButton watchLinks={watchLink} playHandler={handleVideoSourcePlay} />
            ) : (
              <>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 w-auto h-auto py-2 px-3 text-center text-white text-sm">
                  {transformToCapitalize(status)}
                </div>
              </>
            )}
            {imdbRating && (
              <div className="absolute top-1 right-2 w-auto h-auto flex gap-1 items-center bg-gray-900 bg-opacity-70 text-xs font-semibold text-gray-200 px-2 py-1 rounded-md">
                <svg width="12" height="12" className="text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>
                {imdbRating}
              </div>
            )}

          </div>

          <div className="w-full h-auto py-3 flex flex-col mobile:flex-col-reverse">

            <div className="mobile:px-2.5 space-y-3">

              <div className="flex flex-wrap items-center space-x-1">
                <strong className="text-base text-gray-200 font-bold">Title:</strong>
                <h1 className="text-sm text-gray-300 font-semibold">{title}</h1>
              </div>

              <div className="flex flex-wrap items-center space-x-1">
                <strong className="text-base text-gray-200 font-bold">Year:</strong>
                <div className="text-sm text-gray-300 font-semibold mt-1">{releaseYear}</div>
              </div>

              {fullReleaseDate && (
                <div className="flex flex-wrap items-center space-x-1">
                  <strong className="text-base text-gray-200 font-bold">
                    {status === "released" ? "Released:" : "Expeted relesed:"}
                  </strong>
                  <div className="text-sm text-gray-300 font-semibold mt-1">{formattedDate}</div>
                </div>
              )}

              <div className="flex flex-wrap items-center space-x-1">
                <strong className="text-base text-gray-200 font-bold">Language:</strong>
                <Link href={`/browse/category/${language?.replace(" ", "-")}`} className="text-sm text-gray-300 font-semibold mt-1">
                  {language?.charAt(0).toUpperCase() + language?.slice(1)}
                  {status === "Coming Soon" && language === "hindi dubbed" && " (coming soon)"}
                </Link>
              </div>

              {castDetails?.length > 0 && (
                <div className="flex flex-wrap items-center space-x-1">
                  <strong className="text-base text-gray-200 font-bold">Star cast:</strong>
                  {castDetails?.map((cast, index) => (
                    <div key={index} className="text-gray-300 text-xs font-semibold mt-1">
                      {cast}
                      {index !== castDetails.length - 1 && ','}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center space-x-1">
                <strong className="text-base text-gray-200 font-bold flex-wrap">Genre:</strong>
                {genre?.map((g, index) =>
                  g !== "N/A" && (
                    <Link key={index} className="text-gray-300 text-xs font-semibold mt-1" href={`/browse/genre/${g?.toLowerCase().replace(/[' ']/g, '-')}`}>
                      {index !== genre.length - 1 ? `${g} ${'\u2022'} ` : g}
                    </Link>

                  ))}
              </div>

            </div>
            <div className="px-1.5 mobile:pb-3 space-x-1.5 md:my-6 max-w-lg">
              <p className="text-xs text-yellow-500 font-semibold leading-[18px]"><strong className="text-sm text-gray-200 mr-0.5">Note: </strong>
                If this {type} does not play, then please connect to any VPN and enjoy. <span className="font-bold text-gray-200">Our suggestion:</span> This problem occurs mostly at night so try to watch before night. thanks for using our site.
              </p>
            </div>
            <MoviesUserActionOptions movieData={movieDetails} />
          </div>

        </div>

      </div>

      <div className="py-2">
        {/**** Show Suggest Data Based on Gnere ******/}
        <SliderShowcase moviesData={suggestions?.genreList} title="You might also like" />
        {/**** Show Suggest Data Based on Cast ******/}
        <SliderShowcase moviesData={suggestions?.castList} title="Explore more from same actor" />
      </div>

    </div>
  )
};

function PlayButton({ watchLinks, playHandler }) {

  const [showDropdown, setDropDown] = useState(false);

  const play = () => {
    if (watchLinks.length === 1) {
      playHandler(watchLinks[0]);
    } else {
      setDropDown((prev) => !prev)
    };
  };

  return (
    <>
      <div className="w-auto h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button type="button"
          onClick={play}
          title="Play"
          className="bg-gray-950 bg-opacity-70 text-gray-100 hover:text-cyan-500 w-12 h-12 flex justify-center items-center rounded-full transition-transform duration-300 hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="currentColor"
            role="presentation"
          >
            <path d="M10.8 15.9l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1a.5.5 0 0 0-.8.4v7c0 .41.47.65.8.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>

          <span className="sr-only">Play video</span>
        </button>
      </div>
      <ModelsController visibility={showDropdown} closeEvent={() => setDropDown(false)}>
        <div className={`w-56 h-auto py-3.5 px-2 bg-gray-100 shadow-2xl rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20`}>
          <button
            onClick={() => setDropDown(false)}
            className="font-medium text-gray-600 hover:text-gray-800 float-right outline-none"
            type="button"
          >
            <i className="bi bi-x-circle"></i>
            <span className="sr-only">Close</span>
          </button>
          <div className="text-gray-900 font-semibold mx-1.5">Select server</div>
          <div className="text-sm text-gray-800 space-y-2.5 mt-2 mx-1">
            {watchLinks.map((data, index) => (
              <div key={index} className="mx-auto self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    playHandler(data.source); // Call the play handler
                  }}
                  className="flex items-center font-medium w-full h-auto"
                >
                  <i className={`bi bi-dot ${index === 0 ? "text-cyan-500" : "text-yellow-500"} text-xl`}></i>
                  <span className="mr-1.5">{data.label}</span>
                  <span className="text-xs text-gray-700 font-normal">{data.labelTag}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </ModelsController>

    </>
  )
}
