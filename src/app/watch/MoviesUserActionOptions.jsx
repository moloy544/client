'use client'

import { creatToastAlert } from "@/utils";
import { safeLocalStorage } from "@/utils/errorHandlers";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReportModel = dynamic(() => import('@/components/models/ReportModel'));

export default function MoviesUserActionOptions({ movieData }) {

  const [isSaved, setIsSaved] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  //Share movie function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: `Watch ${movieData.title + " " + '(' + movieData.releaseYear + ')' + " " + movieData.type} online free only on moviesbazaar`,
        url: window.location.href,
      })
        .catch((error) => console.error('Error sharing movie:', error));
    };
  };


  const saveInLocalStorage = () => {
    const localStorageData = safeLocalStorage.get('saved-movies-data');
    const parseData = localStorageData ? JSON.parse(localStorageData) : [];
    const index = parseData?.findIndex((data) => data.imdbId === movieData.imdbId);

    if (index === -1) {
      // Movie not found, add it
      setIsSaved(true);
      const dateNow = new Date();
      parseData.unshift({ imdbId: movieData.imdbId, addAt: dateNow });
      creatToastAlert({
        message: `Add ${movieData.title+' ' + movieData.type} To Watch Later`
      });

    } else {
      // Movie found, remove it
      parseData.splice(index, 1);
      setIsSaved(false);
      creatToastAlert({
        message: `Remove ${movieData.title + ' ' + movieData.type} From Watch Later`
      })
    }

    if (parseData.length === 0) {
      safeLocalStorage.remove('saved-movies-data');
    } else {
      safeLocalStorage.set('saved-movies-data', JSON.stringify(parseData));
    }
  };

  const openModel = () => {
    setIsModelOpen(true);
  }


  useEffect(() => {

    const localStorageData = safeLocalStorage.get('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const isAvailable = parseData?.some((data) => data.imdbId === movieData.imdbId);

    setIsSaved(isAvailable);

  }, [])

  return (
    <>

      <div className="w-auto h-auto mt-3 flex gap-5 mobile:gap-2.5 justify-around mobile:justify-evenly overflow-x-scroll scrollbar-hidden">

        <div onClick={saveInLocalStorage} role="button" title="Save" className="w-auto h-auto flex gap-1 justify-center items-center text-gray-300 bg-gray-900 lg:hover:bg-gray-800 py-1.5 px-3 rounded-2xl">
          {isSaved ? (
            <i className="bi bi-check-square-fill text-yellow-500"></i>
          ) : (
            <svg fill="#d1d5db" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
              <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path>
            </svg>
          )}

          <div className="text-xs font-semibold">{isSaved ? "Saved" : "Save"}</div>

        </div>

        <div onClick={handleShare} role="button" title="Share" className="flex gap-1.5 items-center text-gray-300 bg-gray-900 lg:hover:bg-gray-800 px-3.5 py-1 rounded-2xl">
          <svg fill="#d1d5db" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
            <path d="M15 5.63L20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path>
          </svg>
          <div className="text-xs font-semibold">Share</div>
        </div>

        <div
          onClick={openModel}
          role="button"
          title="Report"
          className="flex gap-1.5 items-center text-gray-300 bg-gray-900 lg:hover:bg-gray-800 px-3 py-1.5 rounded-2xl"
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

      </div>
      {isModelOpen && (
        <ReportModel
          movieData={movieData}
          setIsModelOpen={setIsModelOpen}
          isOpen={isModelOpen}
        />
      )}

    </>
  )
};


