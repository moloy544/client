'use client'

import { useRef, useState } from "react";
import axios from "axios";
import { ModelsController } from "@/lib/EventsHandler";
import { appConfig } from "@/config/config";

export default function ReportModel({ id, content_title, status, setIsModelOpen, isOpen, windowCurrentWidth, isDownloadOption, watchLinks = null, playHandler, currentPlaySource, isAllRestricted }) {

  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState("Pending");
  const [processedReports, setProcessedReports] = useState(false);
  const [serverSuggestion, setServerSuggestion] = useState({
    isModelOpen: false,
    want_report: false,
    serversData: [],
  });

  const writtenReportRef = useRef(null);

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
    const body = document.querySelector('body');
    body.removeAttribute('class', 'scrollbar-hidden');
    body.style.overflow = '';
  }

  const handleSelectedReport = (e) => {

    const reportValue = e.target.value;

    const isChecked = e.target.checked;

    if (isChecked && reportValue === "Video not playing" && !serverSuggestion.want_report && watchLinks && watchLinks.length > 1) {
      const availableEmbedServer = watchLinks?.filter(({ source }) =>
        !source.includes('.m3u8') && !source.includes('.mkv') && !source.includes('.txt') && source !== currentPlaySource
      ) || [];

      setServerSuggestion((prevData) => ({
        ...prevData,
        isModelOpen: true,
        serversData: availableEmbedServer,
      }));
    };

    if (message !== "Pending") {
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

  const playAlterNativeServer = (source) => {

    if (source) {
      playHandler(source);
      setServerSuggestion({
        isModelOpen: false,
        want_report: false,
        serversData: null,
      });
      setIsModelOpen(false);
    } else {
      console.error("No embed URL found in watch links");
    }

  };

  const handleReportSubmit = async () => {

    try {
      if (processedReports) return;
      const writenReport = writtenReportRef.current?.value.trim();

      if (selectedReports.length === 0 && writenReport.length === 0) {
        setMessage("Please select or describe your problem with at least 10 characters.");
        return;
      } else if (writenReport.length > 0 && writenReport.length < 10) {
        setMessage("Your described report is too short. Please describe your problem with at least 10 characters.");
        return;
      }
      setProcessedReports(true);
      const reportResponse = await axios.create({
        baseURL: appConfig.backendUrl,
        withCredentials: true
      }).post('/api/v1/user/action/report', {
        reportData: {
          content_id: id,
          content_title,
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
      } else {
        setMessage(reportResponse.data.message);
      }

    } catch (error) {
      //console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred while reporting");
      }
    } finally {
      setProcessedReports(false);
    };
  };

  const baseOptions = [
    { value: "Video not playing", id: "video-option-checkbox", condition: () => status === "released" && isAllRestricted ? false : true },
    { value: "Audio not working", id: "audio-option-checkbox", condition: () => status === "released" && isAllRestricted ? false : true },
    { value: "Download not working", id: "download-option-checkbox", condition: () => isDownloadOption && isAllRestricted ? false : true },
    { value: "Image not showing", id: "image-option-checkbox", condition: () => true },
    { value: "Share not working", id: "share-option-checkbox", condition: () => true },
  ];
  
  const reportOptions = baseOptions.map(option => ({
    ...option,
    visible: option.condition(),
  }));
  

  return (
    <>
      <ModelsController visibility={isOpen} transformEffect={windowCurrentWidth ? windowCurrentWidth <= 450 : false} windowScroll={false}>
        <div className="w-full h-full fixed top-0 left-0 flex justify-center sm-screen:items-end items-center bg-gray-950 bg-opacity-50 z-[60]"
          style={{ transform: 'translateY(100%)' }}
        >

          <div className={`sm-screen:w-full w-auto max-w-md mx-4 ${message !== "Success" ? "sm-screen:absolute z-20 sm-screen:bottom-0 sm-screen:rounded-b-none" : "max-w-[fit-content]"} sm-screen:m-auto w-auto h-fit rounded-lg sm-screen:rounded-xl bg-white p-4 shadow-2xl border border-gray-300`}>

            {message !== 'Success' ? (
              <>
                <div className="space-y-2 mb-4 max-w-sm">
                  <h2 className="text-base font-bold leading-4">Are you sure you want to report?</h2>
                  <p className="mt-2 text-xs text-gray-600 font-medium">
                    Please select the issue or describe the problem. We are solve your problem within 6 hours.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 my-2">
                  {reportOptions.map(({ value, id, visible }) =>
                    visible ? (
                      <div key={id} className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 shadow-sm">
                        <input
                          id={id}
                          type="checkbox"
                          value={value}
                          onChange={handleSelectedReport}
                          className="w-4 h-4 cursor-pointer text-blue-600 bg-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-lg"
                        />
                        <label
                          htmlFor={id}
                          className="text-xs font-medium text-gray-900 cursor-pointer"
                        >
                          {value}
                        </label>
                      </div>
                    ) : null
                  )}
                </div>

                <div className="my-3">
                  <label htmlFor="message" className="block mb-2 text-sm font-semibold text-gray-900">
                    Write other problem (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows="2"
                    ref={writtenReportRef}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your problem here..."
                  />
                </div>

                {message !== "Success" && message !== "Pending" && (
                  <div className="my-1 max-w-sm">
                    <p className="text-red-pure text-xs font-medium">{message}</p>
                  </div>
                )}
                <div className="py-3 flex gap-5 mobile:my-3">
                  <button
                    type="button"
                    onClick={handleReportSubmit}
                    className="rounded bg-rose-600 w-20 h-10 flex justify-center items-center text-xs font-medium text-gray-100"
                  >
                    {!processedReports ? "Report" : <div className="three_dots_loading w-2 h-2"></div>}
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
              <h2 className="w-60 h-auto text-green-600 text-center text-sm font-medium">Thanks for reporting us we are solve your issue soon as possible</h2>
            )}
          </div>

        </div>

      </ModelsController>

      <ModelsController visibility={serverSuggestion.isModelOpen} windowScroll={false}>
        <div className="fixed inset-0 z-[62] bg-black bg-opacity-50 flex justify-center items-center">
          <div className="w-full max-w-sm bg-white px-6 py-5 space-y-6 border border-gray-300 shadow-xl rounded-lg mx-4">
            <div className="flex items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill text-red-600 text-3xl"></i>
              <div className="text-lg font-semibold text-gray-900">Please Confirm</div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
            Before reporting a video issue, we recommend trying the content on all suggested servers. If none of the options work, please proceed to report the problem.
            </div>
            <div className="flex justify-between flex-wrap gap-3">
              {serverSuggestion.serversData?.map(({ source, label, labelTag }, index) => (
                <button
                  key={index}
                  onClick={() => playAlterNativeServer(source)}
                  className="bg-teal-700 hover:bg-teal-800 transition text-gray-200 hover:text-white text-sm px-5 py-3 rounded-lg w-full sm:w-auto font-medium"
                >
                  <span>{label}</span>
                 {labelTag &&(
                   <span className="ml-2">{labelTag}</span>
                 )}
                </button>
              ))}

              <button
                onClick={() => {
                  setServerSuggestion({
                    isModelOpen: false,
                    want_report: false,
                    serversData: null,
                  });
                }}
                className="bg-gray-800 hover:bg-gray-700 transition text-white px-5 py-3 rounded-lg w-full sm:w-auto text-sm font-medium"
              >
                No, I&lsquo;ll report
              </button>
            </div>
          </div>
        </div>
      </ModelsController>
    </>
  );

};