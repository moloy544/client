'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Script from "next/script";
import Image from "next/image";
import { useSelector } from "react-redux";
import { createToastAlert, resizeImage, transformToCapitalize } from "@/utils";
import { ModelsController } from "@/lib/EventsHandler";
import MoviesUserActionOptions from "./MoviesUserActionOptions";
import Breadcrumb from "@/components/Breadcrumb";
import SliderShowcase from "@/components/SliderShowcase";
import VideoPlayer from "@/components/player/VideoPlayer";
import { usePathname } from "next/navigation";
import { useOnlineStatus } from "@/lib/lib";
import { openDirectLink, runPopunder } from "@/utils/ads.utility";
import { removeScrollbarHidden } from "@/helper/helper";
import { safeLocalStorage, safeSessionStorage } from "@/utils/errorHandlers";
import RestrictedModal from "@/components/modals/RestrictedModal";
import RestrictionsCheck from "@/components/RestrictionsCheck";
import { PlayerGuideModal } from "@/components/modals/PlayerGuideModal";

const VidStackPlayer = dynamic(() => import("@/components/player/VidStackPlayer"), { ssr: false });

function formatDateToString(fullReleaseDate) {

  if (fullReleaseDate) {
    const originalDate = new Date(fullReleaseDate);

    const formattedDate = originalDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return formattedDate
  };
  return "N/A"
}

export default function MovieDetailsComponent({ movieDetails, suggestions, userIp }) {

  const {
    imdbRating,
    title,
    imdbId,
    thumbnail,
    releaseYear,
    fullReleaseDate,
    genre,
    castDetails,
    language,
    category,
    type,
    status,
    hlsSourceDomain,
    videoTrim,
    watermark,
    multiAudio,
    default_audio,
    isContentRestricted,
    permanentDisabled,
    isAdult,
    isInTheater,
    seriesData,
    ticketBookLink
  } = movieDetails || {};

  // Fotmat date to string 
  const fullReleaseDateString = formatDateToString(fullReleaseDate);

  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [takeScreenshot, setTakeScreenshot] = useState(false);
  const [isAllRestricted, setIsAllRestricted] = useState(false);
  const { isUserRestricted, UserRestrictedChecking } = useSelector(
    (state) => state.fullWebAccessState
  );
  const pathname = usePathname();
  const isOnline = useOnlineStatus({
    onlineCallback: () => {
      createToastAlert({
        message: 'Connection restored. You are back online.',
      });
    },
    offlineCallback: () => {
      createToastAlert({
        message: 'You are offline. Please check your internet connection.',
      });
    }
  });

  const handleVideoSourcePlay = (source, callBack) => {

    // Internet connection check 
    if (!isOnline) {
      createToastAlert({
        message: "You are offline. Please check your internet connection.",
        visibilityTime: 6000
      });
    }
    // Validate if no video source and show report message
    if (!source) {
      createToastAlert({
        message: `Can't play this ${type}. Please report to us.`,
      });
      return;
    };

    setVideoSource(source);

    const findRpmplayOnline = movieDetails.watchLink?.filter((data) => data.source.includes('rpmplay.online') || data.source.includes('p2pplay.online') || data.source.includes('mivalyo.com'));

    const handlePlayerVisibility = () => {

      removeScrollbarHidden();

      // Update the URL to include 'play=true' without reloading the page
      const params = new URLSearchParams(window.location.search);
      const playQuery = params.get("play");
      if (!playQuery) {
        params.set('play', 'true'); // Add play=true to the query parameters
        // Use history.pushState() to update the URL without causing a page reload
        const newUrl = `${pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
        // Set player visibility to true to show the player
        setPlayerVisibility(true);
      } else {
        setPlayerVisibility(false);
      };

      if (callBack && typeof callBack === 'function') {
        callBack();
      };
    };

    if (findRpmplayOnline?.length === 0) {
      openDirectLink(
        handlePlayerVisibility()
      );
    } else {
      handlePlayerVisibility();
      runPopunder(8000);
    };
  };

  // check is the user report the disabled content 
  useEffect(() => {
    if (isContentRestricted && isUserRestricted && !UserRestrictedChecking) {
      const id = imdbId?.replace("tt", "");

      if (!id) return; // Skip if no valid ID

      const existingRaw = safeLocalStorage.get("report_history");
      let history = [];

      try {
        const parsed = JSON.parse(existingRaw);
        history = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        history = [];
      }

      if (history.includes(id)) {
        setIsAllRestricted(false);
      } else {
        setIsAllRestricted(true);
      }
    }
  }, [isUserRestricted, imdbId, UserRestrictedChecking]);


  useEffect(() => {
    // Check for 'play' query on initial load or URL change (popstate triggered)
    const checkPlayQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const playQuery = params.get("play");

      // If 'play=true' is in the URL and video source exists, show the player
      if (playQuery === 'true' && videoSource) {
        setPlayerVisibility(true);
      } else if (!playQuery && playerVisibility) {
        // If 'play' is removed from the URL and player is visible, hide the player
        setPlayerVisibility(false);
        if (takeScreenshot) {
          setTakeScreenshot(false)
        }
      }

      // If the page was opened directly with 'play=true' but no video source is set, remove 'play=true' from the URL
      if (playQuery && !videoSource) {
        params.delete('play');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname; // Check if there are other query params
        window.history.replaceState({}, '', newUrl); // Replace URL without reloading the page
      }

    };

    // Call checkPlayQuery to handle initial load (e.g., if user refreshes with 'play' in URL)
    checkPlayQuery();

    // Attach event listener for back/forward navigation
    window.addEventListener("popstate", checkPlayQuery);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", checkPlayQuery);
    };
  }, [playerVisibility, videoSource, takeScreenshot]);

  // Create Breadcrumb
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

  const isHLSPlayListAvailble = movieDetails.watchLink.some(({ source }) => source.includes('.m3u8') || source.includes('.mkv') || source.includes('.txt'));

  return (
    <>
      <Breadcrumb data={breadcrumbData} />

      <div className="my-6 mobile:my-2.5 flex justify-center items-center">

        <div className={`h-fit w-full ${playerVisibility && videoSource ? "max-w-full mx-4" : "max-w-5xl mx-3"} mobile:mx-1 p-2.5 md:p-6 flex mobile:flex-col items-center gap-8 mobile:gap-0 mobile:marker:gap-0 bg-[rgb(29,39,59)] rounded-md shadow-md`}>

          <div className={`mobile:w-full mobile:mt-2.5 md:min-w-[400px] lg:min-w-[600px] max-w-[600px] min-h-full mx-auto bg-gray-900 ${playerVisibility && videoSource ? "block" : "hidden"}`}>

            {playerVisibility && videoSource && (
              <>
                {videoSource.includes('.txt') ? (
                  <VidStackPlayer
                    title={title}
                    source={videoSource}
                    userIp={userIp}
                  />
                ) : (
                  <VideoPlayer
                    title={title}
                    hlsSourceDomain={hlsSourceDomain}
                    default_audio={default_audio}
                    source={
                      videoSource.includes('?backup_stream=1') || !seriesData
                        ? videoSource
                        : seriesData
                    }
                    userIp={userIp}
                    imdbId={imdbId}
                    onVideoLoad={() => setTakeScreenshot(true)}
                    videoTrim={videoTrim}
                    watermark={watermark}
                  />
                )}
              </>
            )}

          </div>

          <div className={`w-full max-w-[300px] max-h-[400px] ${playerVisibility && videoSource ? "hidden" : 'block'} aspect-[2.4/3] flex-shrink mobile:mt-2 relative overflow-hidden rounded-md border border-gray-700 bg-gray-800`}>

            <Image
              priority
              className="transition-transform duration-8000 transform-gpu animate-zoom select-none pointer-events-none"
              src={thumbnail}
              alt={title + " " + type + " thumbnail" || `${type} thumbnail`}
              fill />

            <PlayButton
              watchLinks={movieDetails.watchLink}
              content_status={status}
              fullReleaseDateString={fullReleaseDateString}
              playHandler={handleVideoSourcePlay}
              contentTitle={title}
              contentType={type || "content"}
              isAllRestricted={isAllRestricted}
              UserRestrictedChecking={UserRestrictedChecking}
              isAdult={isAdult}
              seriesData={seriesData}
              isInTheater={isInTheater}
              ticketBookLink={ticketBookLink}
            />

            {imdbRating && (
              <div className="absolute top-1 right-2 w-auto h-auto flex gap-1 items-center bg-gray-900 bg-opacity-70 text-xs font-semibold text-gray-200 px-2 py-1 rounded-md">
                <svg width="12" height="12" className="text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>
                {imdbRating}
              </div>
            )}

          </div>

          <div className="w-full h-auto py-3 flex flex-col mobile:flex-col-reverse">

            <div className={`mobile:px-2.5 space-y-3 ${playerVisibility && "lg:inline-flex lg:justify-between"} space-x-21`}>

              <div className="space-y-4">

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
                      {status === "released" ? "Released:" : "Expected Release:"}
                    </strong>
                    <div className="text-sm text-gray-300 font-semibold mt-1">{fullReleaseDateString}</div>
                  </div>
                )}

                <div className="flex flex-wrap items-center space-x-1">
                  <strong className="text-base text-gray-200 font-bold">Language:</strong>
                  <Link href={`/browse/category/${language?.replace(" ", "-")}`} className="text-sm text-gray-300 font-semibold mt-1" prefetch={false}>
                    {transformToCapitalize(multiAudio ? language + " + Multi" : language)}
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
                      <Link key={index} className="text-gray-300 text-xs font-semibold mt-1" href={`/browse/genre/${g?.toLowerCase().replace(/[' ']/g, '-')}`} prefetch={false}>
                        {index !== genre.length - 1 ? `${g} ${'\u2022'} ` : g}
                      </Link>

                    ))}
                </div>

              </div>

              {playerVisibility && (
                <div className="hidden lg:block mx-1.5">
                  <Image
                    width={115}  // Fixed width
                    height={120} // Fixed height
                    priority
                    className="select-none pointer-events-none min-w-[115px] max-w-[115px] h-auto aspect-[2.9/4] rounded-md border border-gray-700"
                    src={resizeImage(thumbnail, 'w200')}
                    alt={title}
                  />
                </div>
              )}
            </div>

            <div className="px-1.5 mobile:pb-3 space-x-1.5 md:my-6 max-w-lg">
              <p className="text-xs text-yellow-500 font-semibold leading-[18px]">
                <span className="text-sm text-gray-200 mr-0.5">Note:</span>
                {status?.toLowerCase() === "copyright remove"
                  ? "Unfortunately, this content is currently unavailable due to copyright restrictions. We apologize for the inconvenience."
                  : `If this ${type} isn't playing correctly, ${movieDetails.watchLink?.length > 1 ? 'try all available playback option or click the "Report" button.' : 'please click the "Report" button.'} We appreciate your feedback and support!`
                }
              </p>
            </div>

            <MoviesUserActionOptions
              isOnline={isOnline}
              movieData={movieDetails}
              reportButton={status?.toLowerCase() === "copyright remove" ? false : true}
              playHandler={handleVideoSourcePlay}
              currentPlaySource={videoSource}
              takeScreenshot={takeScreenshot}
              isAllRestricted={isAllRestricted}
            />
          </div>

        </div>

      </div>

      <div className="py-2">
        {/**** Show Suggest Data Based on Gnere ******/}
        <SliderShowcase
          moviesData={suggestions?.genreList}
          title="You might also like"
        />
        {/**** Show Suggest Data Based on Cast ******/}
        <SliderShowcase
          moviesData={suggestions?.castList}
          title="Explore more from same actor"
        />
      </div>

      {/* Restriction Check Component */}

      <RestrictionsCheck
        isRestricted={isContentRestricted && isContentRestricted === true ? true : false}
        urgentCheck={permanentDisabled ? true : false} />
      {(isHLSPlayListAvailble || seriesData) && (
        <Script
          id={seriesData ? 'series-playerjs-script' : 'playerjs-script'}
          src={`/static/js/${seriesData ? 'series_player_v1.js' : 'player_v2.1.js'}`}
          strategy="afterInteractive"
        />
      )}
    </>
  )
};

function PlayButton({
  watchLinks,
  playHandler,
  contentTitle,
  content_status,
  fullReleaseDateString,
  contentType,
  isAllRestricted,
  isInTheater,
  ticketBookLink,
  isAdult,
  UserRestrictedChecking = false,
}) {
  const [showDropdown, setDropDown] = useState(false);
  const [isRpmplayOnline, setIsRpmplayOnline] = useState(false);
  const [isInstractionsModalOpen, setInstractionsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlaySource, setSelectedPlaySource] = useState(null);
  const [adultAlert, setAdultAlert] = useState(false);

  const rpmShareSourceIndex = watchLinks.findIndex(({ source }) =>
    source.includes("rpmplay.online") || source.includes("p2pplay.online") || source.includes('mivalyo.com')
  );

  const play = () => {
    if (isAllRestricted) {
      setDropDown((prev) => !prev);
      openDirectLink();
      return;
    }

    if (!watchLinks || watchLinks.length === 0 && !seriesData) {
      createToastAlert({
        message: "Playback is disabled by mistake please report us",
        visibilityTime: 6000,
      });
      return;
    };

    const findRpmplayOnline = watchLinks.filter(({ source }) =>
      source.includes("rpmplay.online") || source.includes("p2pplay.online") || source.includes('mivalyo.com')
    );
    if (findRpmplayOnline.length > 0 || content_status === "coming soon") {
      setIsRpmplayOnline(findRpmplayOnline.length > 0);
      openDirectLink();
    }

    setDropDown((prev) => !prev);
  };

  const checkAdult = () => {
    const isAdultConfirm = safeSessionStorage.get("isAdultConfirmed");
    if (isAdultConfirm) {

    }
    if (isAdult) {
      if (isAdultConfirm) {
        play();
      } else {
        setAdultAlert(true)
      }

    } else {
      play();
    }
  };

  const hideDropDown = () => {
    setDropDown(false);
  };

  const isOnlyRpmPlaySource =
    (watchLinks.length === 1 || watchLinks.length === 2) &&
    watchLinks?.some(
      ({ source }) =>
        source.includes("rpmplay.online") || source.includes("p2pplay.online") || source.includes('mivalyo.com')
    );

  const selectedSourceIndex = watchLinks?.findIndex(({ source }) => source === selectedPlaySource)

  return (
    <>
      {/* Centered Play Button */}
      <div className="w-auto h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={checkAdult}
          title="Play"
          className="bg-gray-950 bg-opacity-70 text-gray-100 hover:text-cyan-500 w-12 h-12 flex justify-center items-center rounded-full transition-transform duration-300 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="currentColor"
            role="presentation"
          >
            <path d="M10.8 15.9l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1a.5.5 0 0 0-.8.4v7c0 .41.47.65.8.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          <span className="sr-only">Play video</span>
        </button>
      </div>

      <ModelsController visibility={adultAlert} windowScroll={false}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-[2px] px-3 py-2">
          <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative">
            <h2 className="text-2xl mobile:text-xl font-bold text-red-600 mb-4">🔞 18+ Age Warning</h2>
            <p className="text-gray-300 mb-6 text-base">
              This video is for adults only. It may include sexual scenes, strong language, violence, or other mature content.
              Click Continue only if you are 18 or older and comfortable with such material.
            </p>
            <div className="flex justify-around text-sm">
              <button
                onClick={() => {
                  setAdultAlert(false)
                  play();
                  safeSessionStorage.set("isAdultConfirmed", "true")
                }}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition duration-300"
              >
                I am 18+ Continue
              </button>
              <button
                onClick={() => setAdultAlert(false)}
                className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-xl transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </ModelsController>

      {/* Confirmation Modal Before Play */}
      {showConfirmModal && selectedPlaySource && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-lg text-center relative space-y-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              type="button"
              className="bg-gray-400 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-400 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-2 right-3"
              aria-label="Close"
            >
              <i className="bi bi-x-lg text-base"></i>
            </button>
            <h2 className="text-lg font-bold text-gray-800 pt-1.5">
              Playback Guide For This Server
            </h2>
            <p className="text-sm text-gray-600 font-semibold">
              If the video buffers, just tap the <strong>10 second</strong> skip button to continue playback. Use 10 second back button to catch skipped scenes. This trick works best when the video keeps buffering.
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              If you see <strong>Opss! Sandboxed our player is not allowed</strong> in the video player, please avoid using adblock browsers or adblock apps. For the best experience, use the Chrome browser.
            </p>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                playHandler(selectedPlaySource, hideDropDown);
              }}
              className="mt-3 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              Continue to Play
            </button>
          </div>
        </div>
      )}

      {/* Main Modal Logic */}
      {showDropdown && UserRestrictedChecking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center relative mx-4 py-8 px-6 flex items-center justify-center flex-col space-y-4">
            <button
              onClick={hideDropDown}
              type="button"
              className="bg-gray-400 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-400 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-2 right-3"
              aria-label="Close"
            >
              <i className="bi bi-x-lg text-base"></i>
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 animate-spin fill-teal-600"
              viewBox="0 0 24 24"
            >
              <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
            </svg>
            <span className="text-base font-semibold text-gray-800">
              Please wait, we are verifying...
            </span>
          </div>
        </div>
      ) : showDropdown && isAllRestricted ? (
        <RestrictedModal
          onClose={hideDropDown}
          contentTitle={contentTitle}
          contentType={contentType}
          isInTheater={isInTheater}
          ticketBookLink={ticketBookLink}
        />
      ) : (
        <ModelsController visibility={showDropdown} windowScroll={false}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50 px-2">
            <div className="w-auto h-auto py-4 px-5 bg-gray-800 shadow-lg rounded-md max-w-xs mx-2">
              {content_status === "released" ? (
                <>
                  <div className="w-full flex justify-around items-center space-x-3 pb-3">
                    <div className="font-bold text-base text-gray-100 text-center whitespace-nowrap">
                      Select Playback Server
                    </div>
                    <button
                      onClick={() => setDropDown(false)}
                      className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600"
                      aria-label="Close"
                    >
                      <i className="bi bi-x-lg text-base"></i>
                    </button>
                  </div>

                  <div className="text-base text-gray-200 my-1.5 text-center flex flex-col space-y-2">
                    {isRpmplayOnline && (
                      <small className="text-xs text-gray-200 font-medium">
                        &#8226; If you choose{" "}
                        <span className="text-yellow-500 font-semibold">
                          server {rpmShareSourceIndex + 1}
                        </span>{" "}
                        Try to play at least 3/4 times. Sometimes the video may
                        take time to load, please be patient.
                      </small>
                    )}
                    {watchLinks.length > 1 && (
                      <small className="font-medium">
                        &#8226; Video not playing?{" "}
                        <span className="font-semibold">Try another server.</span>
                      </small>
                    )}
                    <small className="font-medium">
                      &#8226; Video stop in middle?{" "}
                      <span className="font-semibold">
                        Go back and pick same server again.
                      </span>
                    </small>
                  </div>

                  <p
                    onClick={() => setInstractionsModalOpen(true)}
                    className="text-blue-400 cursor-pointer underline underline-offset-2 my-4 text-sm"
                  >
                    ✅ Click here to Learn how to use player features like
                    changing audio, quality, and more
                  </p>

                  <div className={`space-y-3 my-4 px-1 max-h-52 overflow-y-scroll ${watchLinks.length <= 4 ? "scrollbar-hidden" : ""}`}>
                    {watchLinks?.map((data, index) => (
                      <div key={data.data || index}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlaySource(data.source);
                            if (data.source.includes("p2pplay.online")) {
                              setShowConfirmModal(true);
                            } else {
                              playHandler(data.source, hideDropDown);
                            }
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 bg-[#2d3644] text-white font-medium text-sm rounded-md hover:bg-gray-700 transition capitalize"
                        >
                          <span>
                            {data.label}
                            {watchLinks.length > 1 &&
                              selectedSourceIndex === index && (
                                <i className="bi bi-check-circle-fill text-teal-500 text-xs mx-2.5"></i>
                              )}
                          </span>
                          {data.labelTag && (
                            <span className="text-gray-200 font-normal">
                              {data.labelTag}
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <small className="text-xs text-gray-200">
                      <i className="bi bi-earbuds"></i> Use earphones for better
                      audio.
                    </small>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 relative text-center">
                  <button
                    onClick={() => setDropDown(false)}
                    className="text-gray-200 hover:text-white outline-none bg-gray-900 w-6 h-6 rounded-md absolute right-2 top-2 flex items-center justify-center"
                    type="button"
                    aria-label="Close"
                  >
                    <i className="bi bi-x-lg text-sm"></i>
                  </button>

                  <div className="pt-6 space-y-4 max-w-md">
                    {content_status === "coming soon" ? (
                      <>
                        <h2 className="text-xl font-bold text-gray-100">
                          {`Coming Soon – Releases on ${fullReleaseDateString}`}
                        </h2>

                        <p className="text-sm text-gray-200 font-medium">
                          Expected release:{" "}
                          <span className="text-yellow-300">
                            {fullReleaseDateString}
                          </span>
                          . If it&lsquo;s not available at the release time, please
                          check back later and stay tuned.
                        </p>

                        <p className="text-xs text-gray-300">
                          <strong>Note:</strong> Release dates may occasionally
                          be delayed or extended. While we strive to provide
                          accurate information, schedules are subject to
                          change. We recommend bookmark this page or add to
                          watch later and returning later for updates.
                        </p>
                      </>
                    ) : (
                      <div className="my-5">
                        <h2 className="text-sm font-semibold text-gray-200">
                          {content_status}
                        </h2>
                      </div>
                    )}

                    <Link href="/">
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition duration-300"
                      >
                        Explore More Content
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModelsController>
      )}

      <PlayerGuideModal
        guidePlayerIndex={isOnlyRpmPlaySource ? 2 : 1}
        isOpen={isInstractionsModalOpen}
        handleClose={() => setInstractionsModalOpen(false)}
      />
    </>
  );
}