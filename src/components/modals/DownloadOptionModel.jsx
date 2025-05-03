"use client"

import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { appConfig } from "@/config/config";
import { isAndroid, isIOS } from "@/helper/helper";
import { ModelsController } from "@/lib/EventsHandler"
import { creatToastAlert } from "@/utils";
import FullScreenBackdropLoading from "../loadings/BackdropLoading";
import RestrictedModal from "./RestrictedModal";
import { openDirectLink } from "@/utils/ads.utility";

const formatQualityType = (quality, qualityType) => {

  // Determine label based on specific quality values
  let qualityLabel;

  switch (quality) {
    case '144p':
      qualityLabel = 'Low';
      break;
    case '360p':
      qualityLabel = 'Medium';
      break;
    case '480p':
      qualityLabel = 'Standard';
      break;
    case '720p':
      qualityLabel = 'High';
      break;
    case '1080p':
      qualityLabel = 'Full HD';
      break;
    case '2160p':
      qualityLabel = 'Ultra HD';
      break;
    default:
      qualityLabel = 'HD';
      break;
  };

  if (qualityType.toLowerCase() === "cam") return `(${qualityLabel} - CAM)`

  // Format as "quality (Label)"
  return `(${qualityLabel})`;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function DownloadOptionModel({ isOnline, imdbId, linksData, contentTitle, contentType, isAllRestricted, isInTheater, isOpen, onClose, onReportButtonClick, windowCurrentWidth }) {

  const { title, links, qualityType } = linksData || {};

  //const [downloadOptionUrlData, setDownloadOptionUrlData] = useState([]);
  const [downloadStartProgress, setDownloadStartProgress] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);
  const { UserRestrictedChecking } = useSelector((state) => state.fullWebAccessState);

  const handleDownload = async (sourceIndex, url) => {
    try {
      if (!isOnline) {
        creatToastAlert({
          message: 'You are offline. Please check your internet connection.',
        });
        return;
      }
      setDownloadStartProgress(true);
      openDirectLink();

      // If it's a Pixeldrain link, simulate loading without calling the API
      if (url && url.includes("pixeldrain")) {
        const delayOptions = [1000, 1500, 2000];
        const randomDelay = delayOptions[Math.floor(Math.random() * delayOptions.length)];
        await wait(randomDelay);
        setSourceUrl([url]);
        return;
      }

      // Fetch the HTML content from the URL
      const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/download_source/${imdbId?.replace('tt', '')}?sourceIndex=${sourceIndex}`);

      if (response.status !== 200) {
        creatToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visibilityTime: 12000
        });
        return;
      }

      const { downloadUrl } = response.data || {};

      if (!downloadUrl || downloadUrl.length === 0) {
        creatToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visibilityTime: 12000
        });
        return;
      }

      setSourceUrl(downloadUrl)

    } catch (error) {
      console.error('Error fetching download option URLs:', error);
      creatToastAlert({
        message: 'Download failed. Please try again later, or report the issue to us.',
        visibilityTime: 12000
      });
    } finally {
      setDownloadStartProgress(false);
    }
  };

  // validate if false anything returns nothing
  if (!links || !Array.isArray(links) || links.length === 0) {
    return null
  };

  return (
    <>
      {isOpen && UserRestrictedChecking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center relative mx-4 py-8 px-6 flex items-center justify-center flex-col space-y-4">
            <button
              onClick={onClose}
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
              <path
                d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
              />
            </svg>
            <span className="text-base font-semibold text-gray-800">Please wait, we are verifying...</span>
          </div>
        </div>

      ) : isOpen && isAllRestricted ? (
        <RestrictedModal
          contentTitle={contentTitle}
          contentType={contentType}
          isInTheater={isInTheater}
          onClose={onClose}
        />
      ) : (
        <ModelsController visibility={isOpen} windowScroll={false} transformEffect={windowCurrentWidth ? windowCurrentWidth <= 450 : false}>

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center sm-screen:items-end justify-center z-50">

            <div className="bg-white max-h-full overflow-y-scroll scrollbar-hidden rounded-lg sm-screen:rounded-xl sm-screen:rounded-b-none sm-screen:w-full max-w-[450px] shadow-lg relative">
              <div className="flex justify-around sticky top-0 bg-white py-2">
                <div className="text-lg font-bold my-3 text-black"><i className="bi bi-download"></i> Download Options</div>
                <button type="button"
                  onClick={onReportButtonClick}
                  className="bg-transparent outline-none text-sm font-semibold text-gray-800 px-2">
                  Report
                </button>
              </div>

              <div className="px-5">
                {/* Title */}
                <div className="text-sm text-gray-700 font-bold text-center my-2.5">
                  <p className="break-words whitespace-normal">{title}</p>
                </div>

                {isIOS() ? (
                  <p className="text-xs text-gray-600 font-semibold my-4">
                    <span className="text-gray-800 font-bold">Note:</span> We detected you&rsquo;re using an iPhone.
                    To play this file, install <span className="font-bold text-yellow-600">VLC Player</span> from the App Store,
                    as iOS doesn&rsquo;t support it by default.
                    <a className="text-blue-700 font-semibold underline" href="https://apps.apple.com/app/vlc-for-mobile/id650377962" target="_blank" rel="nofollow">
                      Click here to install VLC Player
                    </a>.
                  </p>
                ) : isAndroid() && (
                  <p className="text-xs text-gray-600 font-semibold my-4">
                    <span className="text-gray-800 font-bold">Note:</span> If the downloaded file is not playing properly on your phone,
                    install <span className="font-bold text-yellow-600">VLC Player</span> from the Play Store.
                    <a className="text-blue-700 font-semibold underline" href="https://play.google.com/store/apps/details?id=org.videolan.vlc" target="_blank" rel="nofollow">
                      Click here to install VLC Player
                    </a>.
                  </p>
                )}

                {/* Download Links */}
                <div className="space-y-2 max-w-sm mx-auto py-1.5">
                  {links.map(({ quality, url, size }, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleDownload(index, url)}
                      className="block w-full text-sm text-cyan-900 hover:text-cyan-800 font-semibold px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md transition"
                    >
                      <span>{quality} - {size}</span>
                      <span className="ml-1.5 capitalize text-gray-800">{formatQualityType(quality, qualityType)}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 space-y-1 font-medium text-xs text-gray-500">

                  <p className="text-center">
                    If the download not start after click, wait a few minutes and try again. You can also try a different download option or watch online if needed.
                  </p>
                </div>

                <div className="bg-white w-full h-auto sticky bottom-0 pb-4 pt-7">
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-900 hover:bg-gray-950 text-gray-50 py-2 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              {sourceUrl && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto text-center">
                    <div className="text-xl font-semibold mb-2">🎉 Download Ready!</div>
                    <div className="text-sm text-gray-600 mb-4 font-medium">
                      Your download is ready. Click the button below to start, and after clicking, please don&lsquo;t close the open window or new tab until the download starts.
                    </div>
                    {sourceUrl.length > 1 && (
                      <div className="text-sm text-gray-600 mb-4 font-medium">
                        <span className="font-bold">Note:</span> We have multiple servers available for this download. If one server is slow or not working, please try another one.
                      </div>
                    )}
                    <div className="space-y-3">
                      {sourceUrl.map((source, index) => (
                        <a
                          key={index}
                          href={source}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className={`block w-full ${index === 0 ? "bg-gray-600 hover:bg-gray-700" : "bg-slate-600 hover:bg-slate-700"} text-white py-2 rounded transition font-semibold`}
                        >
                          {sourceUrl.length > 1 ? `Server ${index + 1} - Download Now` : "Download Now"}
                        </a>
                      ))}
                    </div>
                    <button
                      onClick={() => setSourceUrl(null)}
                      className="mt-3.5 text-base font-medium text-red-pure hover:text-red-700 py-1.5 px-4 my-3"
                    >
                      Close
                    </button>
                  </div>
                </div>

              )}
            </div>
          </div>
        </ModelsController>
      )}

      {downloadStartProgress && (
        <FullScreenBackdropLoading
          loadingSpinner={true}
          loadingMessage="Preparing your download... Please wait."
        />
      )}
    </>
  )
};
