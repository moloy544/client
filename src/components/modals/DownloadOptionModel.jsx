"use client"

import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { appConfig } from "@/config/config";
import { handleEmailUs, isAndroid, isIOS } from "@/helper/helper";
import { ModelsController } from "@/lib/EventsHandler"
import { createToastAlert } from "@/utils";
import FullScreenBackdropLoading from "../loadings/BackdropLoading";
import RestrictedModal from "./RestrictedModal";
import { openDirectLink } from "@/utils/ads.utility";
import { useDeviceType } from "@/hooks/deviceChecker";

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
  if (qualityType.toLowerCase() === "hd-cam") return `(${qualityLabel} - HD CAM)`


  // Format as "quality (Label)"
  return `(${qualityLabel})`;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function DownloadOptionModel({ isOnline, imdbId, linksData, contentTitle, contentType, isAllRestricted, isInTheater, isOpen, onClose, onReportButtonClick }) {

  const { title, links, qualityType } = linksData || {};

  //const [downloadOptionUrlData, setDownloadOptionUrlData] = useState([]);
  const [isInstractionsModalOpen, setInstractionsModalOpen] = useState(false);
  const [downloadStartProgress, setDownloadStartProgress] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [isAdzOpen, setIsAdzOpen] = useState(false);
  const [backupServerResponseSource, setBackupServerResponseSource] = useState({});
  const { UserRestrictedChecking } = useSelector((state) => state.fullWebAccessState);

  const { isIOS, isAndroid, isDesktop } = useDeviceType();

  const handleDownload = async (sourceIndex, url, quality) => {
    try {
      if (!isOnline) {
        createToastAlert({
          message: 'You are offline. Please check your internet connection.',
        });
      }
      setDownloadStartProgress(true);
      const reverseReplacements = [
        { from: 'anony', to: 'pixeldrain' },
        { from: 'anony.nl', to: 'pixeldrain.net' },
        { from: 'vgm', to: 'Vegamovies' },
        { from: 'm4', to: 'Movies4u' },
        { from: 'fdl', to: 'filesdl' },
         { from: 'fdl.st', to: 'filesdl.site' },
      ];

      // Apply all reverse replacements
      if (typeof url === 'string') {
        for (const { from, to } of reverseReplacements) {
          if (url.includes(from)) {
            url = url.replace(from, to);
          }
        }

        // Add back '?download' if it's a pixeldrain URL
        if (url.includes('pixeldrain') && !url.includes('?download')) {
          url += '?download';
        }
      };

      // Use cached backup source if already fetched
      if (backupServerResponseSource?.[quality]) {
        setSourceUrl({ quality, urls: backupServerResponseSource[quality] });
        return;
      };

      // If it's not filesdl.site link, simulate loading without calling the API
      if (!url.includes("filesdl.site")) {
        const delayOptions = [1500, 2000, 2500];
        const randomDelay = delayOptions[Math.floor(Math.random() * delayOptions.length)];
        await wait(randomDelay);
        setSourceUrl({
          quality,
          urls: [url]
        });
        // Backup the source
        setBackupServerResponseSource(prev => ({ ...prev, [quality]: [url] }));

        return;
      };

      // Fetch the HTML content from the URL
      const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/download_source/${imdbId?.replace('tt', '')}?sourceIndex=${sourceIndex}`);

      if (response.status !== 200) {
        createToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visibilityTime: 12000
        });
        return;
      }

      const { downloadUrl } = response.data || {};

      if (!downloadUrl || downloadUrl.length === 0) {
        createToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visibilityTime: 12000
        });
        return;
      };

      // Cache the fetched backup source
      setBackupServerResponseSource(prev => ({ ...prev, [quality]: downloadUrl }));

      setSourceUrl({
        quality,
        urls: downloadUrl
      });

    } catch (error) {
      console.error('Error fetching download option URLs:', error);
      createToastAlert({
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
        <ModelsController visibility={isOpen} windowScroll={false} transformEffect={true}>

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

                {isIOS ? (
                  <p className="text-xs text-gray-600 font-semibold my-4">
                    <span className="text-gray-800 font-bold">Note:</span> We detected you&rsquo;re using an iPhone.
                    To play this file, install <span className="font-bold text-yellow-600">VLC Player</span> from the App Store,
                    as iOS doesn&rsquo;t support it by default.
                    <a className="text-blue-700 font-semibold underline" href="https://apps.apple.com/app/vlc-for-mobile/id650377962" target="_blank" rel="nofollow">
                      Click here to install VLC Player
                    </a>.
                  </p>
                ) : isAndroid ? (
                  <p className="text-xs text-gray-600 font-semibold my-4">
                    <span className="text-gray-800 font-bold">Note:</span> If the downloaded file is not playing properly on your phone,
                    install <span className="font-bold text-yellow-600">VLC Player</span> from the Play Store.
                    <a className="text-blue-700 font-semibold underline" href="https://play.google.com/store/apps/details?id=org.videolan.vlc" target="_blank" rel="nofollow">
                      Click here to install VLC Player
                    </a>.
                  </p>
                ) : (
                  <p className="text-xs text-gray-600 font-semibold my-4">
                    <span className="text-gray-800 font-bold">Note:</span> If the downloaded file is not playing properly on your device, install the <span className="font-bold text-yellow-600">VLC Player</span> from the official website.
                    <a className="text-blue-700 font-semibold underline ml-1" href="https://www.videolan.org/vlc/" target="_blank" rel="nofollow">Click here to download VLC Player</a>.
                  </p>
                )}

                <p onClick={() => setInstractionsModalOpen(true)}
                  className="text-blue-500 cursor-pointer underline underline-offset-2 my-4 text-sm">
                  ✅ Click to learn how to change audio after download (if multiple languages)
                </p>

                {/* Download Links */}
                <div className="space-y-2 max-w-sm mx-auto py-1.5">
                  {links.map(({ quality, url, size }, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        handleDownload(index, url, quality);
                        openDirectLink();
                      }}
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
              {sourceUrl && sourceUrl.urls?.length > 0 && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-2.5">
                  <div className="bg-white rounded-lg shadow-lg px-4 py-3 w-full max-w-sm mx-auto text-center">
                    <div className="text-xl font-semibold mb-2">🎉 Download Ready!</div>
                    <div className="text-sm text-gray-600 mb-4 font-medium">
                      Your download is ready. Click the button below to start, and after clicking, please don&lsquo;t close the open window or new tab until the download starts.
                    </div>
                    {sourceUrl.urls.length > 1 && (
                      <div className="text-sm text-gray-600 mb-4 font-medium">
                        <span className="font-bold">Note:</span> Multiple servers are available for this download. If one is slow or not working, try a different one.
                      </div>
                    )}
                    <div className="font-semibold my-2 text-gray-600">Quality: {sourceUrl.quality}</div>
                    <WaitTimerDownloadOptions
                      sourceUrl={sourceUrl}
                      isAdzOpen={isAdzOpen}
                      setIsAdzOpen={setIsAdzOpen}
                    />
                    <button
                      onClick={() => setSourceUrl(null)}
                      className="mt-5 text-base font-medium text-red-pure hover:text-red-700 py-1.5 px-4 my-3"
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

      <LanguageGuideModal
        isOpen={isInstractionsModalOpen}
        handleClose={() => setInstractionsModalOpen(false)}
      />

      {downloadStartProgress && (
        <FullScreenBackdropLoading
          loadingSpinner={true}
          loadingMessage="Preparing your download... Please wait."
        />
      )}
    </>
  )
};

const LanguageGuideModal = ({ isOpen, handleClose }) => {

  return (

    <ModelsController visibility={isOpen} windowScroll={false} transformEffect={true}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center sm-screen:items-end justify-center z-50 lg:py-4">
        <div className="bg-white max-h-full overflow-y-scroll scrollbar-hidden rounded-lg sm-screen:rounded-xl sm-screen:rounded-b-none sm-screen:w-full max-w-[450px] shadow-lg relative">

          <div className="sticky top-0 bg-white py-2 px-4">
            <h2 className="text-xl font-semibold text-center">
              How to Change Audio Language in VLC
            </h2>
          </div>

          <div className="p-4 pb-7 space-y-4 text-base text-gray-600 font-medium">
            <p><strong className="text-gray-900">Step 1:</strong> Download & install VLC Media Player.</p>
            <p>If not downloaded, choose your OS below to download:</p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 text-base text-gray-700">
              <a
                href="https://play.google.com/store/apps/details?id=org.videolan.vlc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <i className="bi bi-android"></i> Android
              </a>
              <a
                href="https://apps.apple.com/app/vlc-for-mobile/id650377962"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <i className="bi bi-phone"></i> iOS
              </a>
              <a
                href="https://www.videolan.org/vlc/download-windows.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <i className="bi bi-windows"></i> Windows
              </a>
              <a
                href="https://www.videolan.org/vlc/download-macosx.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <i className="bi bi-apple"></i> macOS
              </a>

              <a
                href="https://www.videolan.org/vlc/#download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <i className="bi bi-laptop"></i> Linux
              </a>
            </div>

            <p><strong className="text-gray-900">Step 2:</strong> Search on YouTube:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><em>Search on YouTube:</em></li>
              <li>
                <span className="text-gray-700 font-semibold">Use queries like:</span>
                <ul className="list-disc list-inside ml-6 space-y-1 font-normal">
                  <li>
                    <a
                      href="https://www.youtube.com/results?search_query=How+to+change+audio+track+in+VLC+player+on+Android"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      How to change audio track in VLC player on Android
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/results?search_query=How+to+switch+audio+language+in+VLC+player+on+Windows"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      How to switch audio language in VLC player on Windows
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/results?search_query=Change+audio+and+subtitle+in+VLC+player+on+iOS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Change audio and subtitle in VLC player on iOS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/results?search_query=How+to+enable+subtitles+and+change+audio+track+in+VLC+Mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      How to enable subtitles and change audio track in VLC Mac
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            <p className="text-sm text-gray-600 text-center font-medium">
              Note: Why VLC? We recommend it because it&lsquo;s one of the most popular and easiest to use media players, offering features like easy audio track and subtitle switching (if available).
            </p>

            <p className="text-sm text-gray-600 text-center font-medium">
              Facing any issues? Please feel free to reach out to us via email at <span onClick={handleEmailUs} className="text-blue-500 font-semibold cursor-pointer">
                moviesbazarorg@gmail.com
              </span>
            </p>

          </div>

          <div className="bg-white w-full sticky bottom-0 pb-4 pt-4 justify-center items-center flex">
            <button
              onClick={handleClose}
              className="w-[80%] bg-gray-900 hover:bg-gray-950 text-gray-50 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </ModelsController>
  );
};

function WaitTimerDownloadOptions({ sourceUrl, isAdzOpen, setIsAdzOpen }) {
  const [timeLeft, setTimeLeft] = useState(process.env.NODE_ENV === 'development' ? 0: 15);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-300 font-semibold my-4 text-center">
      {!isReady ? (
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-gray-800 font-semibold"
        >
          Please wait <span className="text-blue-700">{timeLeft} second{timeLeft > 1 ? "s" : ""}</span> to get your download link.
        </motion.span>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >

          {sourceUrl.urls?.map((source, index) =>
            isAdzOpen ? (
              <a
                key={index}
                href={source}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={`block w-full ${index === 0
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-slate-600 hover:bg-slate-700"
                  } text-white py-2 rounded transition font-semibold text-sm`}
              >
                {sourceUrl.urls.length > 1
                  ? `Server ${index + 1} - Download Now`
                  : "Download Now"}
                {source.includes("fdownload.php") && (
                  <span className="text-xs ml-2">(Stable)</span>
                )}
              </a>
            ) : (
              <button
                type="button"
                key={index}
                className={`block w-full ${index === 0
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-slate-600 hover:bg-slate-700"
                  } text-white py-2 rounded transition font-semibold text-sm`}
                onClick={() => {
                  openDirectLink(() => {
                    setIsAdzOpen(true);
                    createToastAlert({
                      message: "Now you can download the content.",
                    });
                  });
                }}
              >
                {sourceUrl.urls.length > 1
                  ? `Server ${index + 1} - Download Now`
                  : "Download Now"}
                {source.includes("fdownload.php") && (
                  <span className="text-xs ml-2">(Stable)</span>
                )}
              </button>
            )
          )}
        </motion.div>
      )}
    </div>
  );
}