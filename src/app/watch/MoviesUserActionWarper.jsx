'use client'

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";

function MoviesUserActionWarper({ movieData }) {

  const [isSaved, setIsSaved] = useState(false);

  //Share movie function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: `Watch ${movieData.title + " " + '(' + movieData.releaseYear + ')' + " " + movieData.type} online free only on moviesbazaar`,
        url: window.location.href,
      })
        .catch((error) => console.error('Error sharing movie:', error));
    } else {

      console.log('Movie URL copied to clipboard');
    }
  };


  const saveInLocalStorage = () => {

    const localStorageData = localStorage.getItem('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const checkIsAvailable = parseData?.some((data) => data.imdbId === movieData.imdbId);

    let data;

    if (checkIsAvailable) {

      data = parseData.filter((data) => data.imdbId !== movieData.imdbId);

      setIsSaved(false);

      if (data.length === 0) {
        localStorage.removeItem('saved-movies-data');
        return;
      }
    } else {

      setIsSaved(true);

      const dateNow = new Date();

      data = [...parseData, { imdbId: movieData.imdbId, addAt: dateNow }];
    }

    localStorage.setItem('saved-movies-data', JSON.stringify(data));
  };

  useEffect(() => {

    const localStorageData = localStorage.getItem('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const isAvailable = parseData?.some((data) => data.imdbId === movieData.imdbId);

    setIsSaved(isAvailable);

  }, [])

  return (
    <>

      <div className="w-auto h-auto mobile:mt-1 mt-4 mobile:pr-4 flex gap-5 overflow-x-scroll scrollbar-hidden">

        <div onClick={saveInLocalStorage} role="button" className="w-auto h-auto flex gap-1 justify-center items-center bg-gray-200 hover:bg-gray-300 py-1 px-2.5 rounded-xl">
          {isSaved ? (
            <i className="bi bi-check-square-fill text-rose-500"></i>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
              <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path>
            </svg>
          )}

          <div className={`text-xs ${isSaved ? "text-gray-900" : "text-gray-700"} font-semibold`}>{isSaved ? "Saved" : "Save"}</div>

        </div>


        <div onClick={handleShare} role="button" className="flex gap-1.5 items-center bg-gray-200 hover:bg-gray-300 px-3.5 py-1 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
            <path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path>
          </svg>
          <div className="text-xs text-gray-700 font-semibold">Share</div>
        </div>

        <ReportModel movieData={movieData} />

      </div>

    </>
  )
}

export default MoviesUserActionWarper;


function ReportModel({ movieData }) {

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState("Pending");

  const writtenReportRef = useRef(null);

  const openModel = () => {
    if (!isModelOpen) {
      setIsModelOpen(true);
    }
  };

  const closeModel = () => {

    if (message !== "") {
      setMessage("Pending")
    };
    if (selectedReports.length > 0) {
      setSelectedReports([]);
    };

    if (writtenReportRef.current?.value !== "") {
      writtenReportRef.current?.value == "";
    }

    setIsModelOpen(false);

  }

  const handleSelectedReport = (e) => {

    const reportValue = e.target.value;

    const isChecked = e.target.checked;

    if (message === "Invalid") {
      setMessage("Pending");
    };

    setSelectedReports((prevData) => {
      if (isChecked) {
        return [...prevData, reportValue];
      } else {
        return prevData.filter((report) => report !== reportValue);
      };
    });
  };


  const handleReportSubmit = async () => {

    try {

      if (selectedReports.length > 0 || writtenReportRef.current?.value.length >= 10) {

        const reportResponse = await axios.post(`${appConfig.backendUrl}/api/v1/user/action/report`, {
          reportData: {
            movie: movieData._id,
            selectedReports,
            writtenReport: writtenReportRef.current?.value,
          }
        });

        if (reportResponse.status === 200) {

          setSelectedReports([]);
          writtenReportRef.current.value = "";
          setMessage("Success");

          setTimeout(() => {
            setMessage("Pending");
            closeModel();
          }, 3000);
        };

      } else {
        setMessage("Invalid");
      };

    } catch (error) {
      console.log(error)
    };
  };

  return (
    <>
      <div
        onClick={openModel}
        role="button"
        className="flex gap-1.5 items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 24 24"
          height="22"
          viewBox="0 0 24 24"
          width="22"
          focusable="false"
        >
          <path d="m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z"></path>
        </svg>

        <div className="text-xs text-gray-700 font-semibold">Report</div>
      </div>
      {isModelOpen && (
        <>
          <div onClick={closeModel} className="fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-30"></div>

          <div className="mobile:w-3/4 max-w-sm mobile:m-auto w-auto h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 rounded-lg bg-white p-4 shadow-2xl border border-gray-300">

            {(message === "Pending") || (message === "Invalid") ? (
              <>
                <h2 className="text-base font-bold leading-4">Are you sure you want to report?</h2>

                <p className="mt-2 text-xs text-gray-600">
                  Please select the issue or describe the problem. We are solve your problem within 6 hours.
                </p>

                <div className="flex flex-wrap gap-3 my-2">

                  {movieData.status === "released" && (
                    <>
                      <div className="flex items-center">
                        <input
                          id="video"
                          type="checkbox"
                          value="Video not play"
                          onChange={handleSelectedReport}
                          className="w-4 h-4 cursor-pointer text-blue-600 bg-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-lg"
                        />
                        <label
                          htmlFor="video"
                          className="ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Video not play
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="audio"
                          type="checkbox"
                          value="Audio not work"
                          onChange={handleSelectedReport}
                          className="w-4 h-4 cursor-pointer text-blue-600 bg-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-lg"
                        />
                        <label
                          htmlFor="audio"
                          className="ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Audio not work
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex items-center">
                    <input
                      id="share"
                      type="checkbox"
                      value="Share not work"
                      onChange={handleSelectedReport}
                      className="w-4 h-4 cursor-pointer text-blue-600 bg-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-lg"
                    />
                    <label
                      htmlFor="share"
                      className="ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      Share not work
                    </label>
                  </div>


                </div>

                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
                  Optional
                </label>
                <textarea
                  id="message"
                  rows="2"
                  ref={writtenReportRef}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your problem here..."
                />
                {message === "Invalid" && (
                  <p className="text-red-pure text-xs my-1">Please select or describe your problem maximum 10 words</p>
                )}
                <div className="mt-4 flex gap-5">
                  <button
                    type="button"
                    onClick={handleReportSubmit}
                    className="rounded bg-rose-600 px-5 py-2 text-xs font-medium text-gray-100"
                  >
                    Report
                  </button>

                  <button
                    onClick={closeModel}
                    type="button"
                    className="rounded bg-gray-900 px-5 py-2 text-xs font-medium text-gray-100"
                  >
                    No, close
                  </button>
                </div>
              </>

            ) : (
              <div className="w-60 h-auto text-green-600 text-center text-sm font-medium">Thanks for reporting us we are solve your issue soon as possible</div>
            )}

          </div>
        </>
      )}
    </>
  );

}
