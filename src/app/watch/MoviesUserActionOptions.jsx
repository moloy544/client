'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { appConfig } from "@/config/config";
import { creatToastAlert, creatUrlLink } from "@/utils";
import { safeLocalStorage } from "@/utils/errorHandlers";
import { openDirectLink } from "@/utils/ads.utility";
import { useCurrentWindowSize } from "@/hooks/hook";
import { isIOS } from "@/helper/helper";
import { useSelector } from "react-redux";


// Report content model dinamic import
const ReportModel = dynamic(() => import('@/components/modals/ReportModel'), {
  ssr: false,
});
// Download content videos model dinamic import
const DownloadOptionModel = dynamic(() => import('@/components/modals/DownloadOptionModel'), {
  ssr: false,
});

const buttonsClass = "flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-gray-300 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#18212b]";

export default function MoviesUserActionOptions({ isOnline, movieData, reportButton = true, playHandler, currentPlaySource }) {

  const [isSaved, setIsSaved] = useState(false);
  const [isReportModelOpen, setIsReportModelOpen] = useState(false);

  const { isUserRestricted } = useSelector((state) => state.fullWebAccessState);

   // get window live current width
   const windowCurrentWidth = useCurrentWindowSize().width;

  const {
    _id,
    imdbId,
    status,
    title,
    releaseYear,
    type,
    downloadLinks,
    watchLink,
    isContentRestricted
  } = movieData || {};

  //Share movie function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: `Watch ${title + " " + '(' + releaseYear + ')' + " " + type} online free only on moviesbazar`,
        url: `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${imdbId?.replace('tt', '')}`,
      })
        .catch((error) => console.error('Error sharing movie:', error));
    };
  };

  const saveInLocalStorage = () => {
    const localStorageData = safeLocalStorage.get('saved-movies-data');
    const parseData = localStorageData ? JSON.parse(localStorageData) : [];
    const index = parseData?.findIndex((data) => data.imdbId === imdbId);

    if (index === -1) {
      // Movie not found, add it
      setIsSaved(true);
      const dateNow = new Date();
      parseData.unshift({ imdbId, addAt: dateNow });
      creatToastAlert({
        message: `Add ${title + ' ' + type} To Watch Later`
      });

    } else {
      // Movie found, remove it
      parseData.splice(index, 1);
      setIsSaved(false);
      creatToastAlert({
        message: `Remove ${title + ' ' + type} From Watch Later`
      })
    }

    if (parseData.length === 0) {
      safeLocalStorage.remove('saved-movies-data');
    } else {
      safeLocalStorage.set('saved-movies-data', JSON.stringify(parseData));
    }
  };

  useEffect(() => {

    const localStorageData = safeLocalStorage.get('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const isAvailable = parseData?.some((data) => data.imdbId === imdbId);

    setIsSaved(isAvailable);

  }, []);

  const isAllRestricted = isUserRestricted && isContentRestricted;

  return (
    <>

      <div className="w-auto h-auto mt-3 flex gap-5 mobile:gap-2.5 justify-around mobile:justify-evenly overflow-x-scroll scrollbar-hidden">

        <div onClick={saveInLocalStorage} role="button" title={isSaved ? "Save" : "Unsave"} className={buttonsClass}>
          {isSaved ? (
            <i className="bi bi-check-square-fill text-yellow-500"></i>
          ) : (
            <svg fill="#d1d5db" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
              <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path>
            </svg>
          )}

          <div className="text-xs font-semibold">{isSaved ? "Saved" : "Save"}</div>

        </div>

        {downloadLinks && downloadLinks.length > 0 && (
          <DownloadButton
            isOnline={isOnline}
            imdbId={imdbId}
            handleReportModelOpen={setIsReportModelOpen}
            downloadLinks={downloadLinks}
            windowCurrentWidth={windowCurrentWidth}
            ontentTitle={title}
            contentType={type}
            isAllRestricted={isAllRestricted}
          />
        )}

        <div onClick={handleShare} role="button" title="Share" className={buttonsClass}>
          <svg fill="#d1d5db" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
            <path d="M15 5.63L20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path>
          </svg>
          <div className="text-xs font-semibold">Share</div>
        </div>

        {reportButton && (

          <div
            onClick={() => setIsReportModelOpen(true)}
            role="button"
            title="Report"
            className={buttonsClass}
          >
            <svg
              fill="#d1d5db"
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="22"
              viewBox="0 0 24 24"
              width="22"
              focusable="false"
            >
              <path d="m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z"></path>
            </svg>

            <div className="text-xs font-semibold">Report</div>
          </div>
        )}

      </div>
      {isReportModelOpen && (
        <ReportModel
          id={_id}
          content_title={title}
          status={status}
          watchLinks={watchLink}
          playHandler={playHandler}
          currentPlaySource={currentPlaySource}
          isDownloadOption={downloadLinks && downloadLinks.length > 0 ? true : false}
          setIsModelOpen={setIsReportModelOpen}
          isOpen={isReportModelOpen}
          windowCurrentWidth={windowCurrentWidth}
          isAllRestricted={isAllRestricted}
        />
      )}

    </>
  )
};

function DownloadButton({ isOnline, imdbId, downloadLinks, isAllRestricted, handleReportModelOpen, windowCurrentWidth, contentTitle, contentType }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDownloadOptionModel = () => {
    setIsModalOpen(true);

    if (!isIOS()) {
      setTimeout(() => {
        openDirectLink();
       }, 1000);
    }else{
      openDirectLink();
    }
      
  };


  return (
    <>
      <div
        onClick={openDownloadOptionModel}
        role="button"
        title="Download"
        className={buttonsClass}
      >
        <svg
          fill="#d1d5db"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          focusable="false"
          aria-hidden="true"
          className="w-5 h-5"
        >
          <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" />
        </svg>
        <div className="text-xs font-semibold">Download</div>
      </div>
      <DownloadOptionModel
        isOnline={isOnline}
        imdbId={imdbId}
        linksData={downloadLinks[0]}
        isOpen={isModalOpen}
        windowCurrentWidth={windowCurrentWidth}
        isAllRestricted={isAllRestricted}
        contentTitle={contentTitle}
         contentType={contentType}
        onClose={() => setIsModalOpen(false)}
        onReportButtonClick={() => {
          setIsModalOpen(false);
          handleReportModelOpen(true)
        }}

      />
    </>
  )
};