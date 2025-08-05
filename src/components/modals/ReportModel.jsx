'use client'

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ModelsController } from "@/lib/EventsHandler";
import { appConfig } from "@/config/config";
import { safeLocalStorage } from "@/utils/errorHandlers";

export default function ReportModel({ id, imdbId, content_title, status, setIsModelOpen, isOpen, isContentSaved = false, handleSaveContent, isDownloadOption, watchLinks = null, playHandler, currentPlaySource, isAllRestricted }) {

  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState("Pending");
  const [processedReports, setProcessedReports] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [serverSuggestion, setServerSuggestion] = useState({
    isModelOpen: false,
    want_report: false,
    serversData: [],
  });

  const writtenReportRef = useRef(null);

  useEffect(() => {
    const saved = safeLocalStorage.get("report_user_email");
    if (saved) setUserEmail(saved);
  }, []);

  // Rpmysource releated
  const rpmShareSourceIndex = watchLinks.findIndex(({ source }) => source.includes('rpmplay.online') || source.includes('p2pplay.online'));
  const isOnlyRpmPlaySource = watchLinks.length === 1 && watchLinks?.some(({ source }) => source.includes('rpmplay.online') || source.includes('p2pplay.online'));

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

    if (isChecked && reportValue === "Video not playing" && !serverSuggestion.want_report && watchLinks && (watchLinks.length > 1 || isOnlyRpmPlaySource)) {
      const availableServer = watchLinks?.filter(({ source }) => source !== currentPlaySource) || [];

      setServerSuggestion((prevData) => ({
        ...prevData,
        isModelOpen: true,
        serversData: availableServer,
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

      if (saveEmail && userEmail) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(userEmail.trim())) {
          setMessage("Please enter a valid email address.");
          return;
        }

        const existingEmail = safeLocalStorage.get("report_user_email");
        const trimmedEmail = userEmail.trim();

        if (!existingEmail || (saveEmail && existingEmail !== trimmedEmail)) {
          safeLocalStorage.set("report_user_email", trimmedEmail);
        };
      };

      if (selectedReports.length === 0 && writenReport.length === 0) {
        setMessage("Please select or describe your problem with at least 10 characters.");
        return;
      } else if (writenReport.length > 0 && writenReport.length < 10) {
        setMessage("Your described report is too short. Please describe your problem with at least 10 characters.");
        return;
      }
      setProcessedReports(true);

      const reportData = {
        content_id: id,
        content_title: content_title + "-" + imdbId,
        selectedReports,
        writtenReport: writtenReportRef.current?.value,
      };
      if (userEmail) {
        reportData.userEmail = userEmail;
      };
      const reportResponse = await axios.create({
        baseURL: appConfig.backendUrl,
        withCredentials: true
      }).post('/api/v1/user/action/report', { reportData });

      if (reportResponse.status === 200) {

        setSelectedReports([]);
        writtenReportRef.current.value = "";
        setMessage("Success");
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
      if (isAllRestricted) {
        const maxHistory = 10;
        const storageKey = "report_history";
        const id = imdbId.replace("tt", "");

        const existingRaw = safeLocalStorage.get(storageKey);
        let history = [];

        try {
          const parsed = JSON.parse(existingRaw);
          history = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          history = [];
        }

        if (id && !history.includes(id)) {
          history.push(id);
          if (history.length > maxHistory) {
            history = history.slice(-maxHistory);
          }
          safeLocalStorage.set(storageKey, JSON.stringify(history));
        }
      };

    };
  };

  const baseOptions = [
    { value: "Video not playing", id: "video-option-checkbox", condition: () => isAllRestricted ? false : status === "released" },
    { value: "Audio not working", id: "audio-option-checkbox", condition: () => isAllRestricted ? false : status === "released" },
    { value: "Download not working", id: "download-option-checkbox", condition: () => isAllRestricted ? false : isDownloadOption },
    { value: "Image not showing", id: "image-option-checkbox", condition: () => true },
    { value: "Share not working", id: "share-option-checkbox", condition: () => true },
  ];

  const reportOptions = baseOptions.map(option => ({
    ...option,
    visible: option.condition(),
  }));

  return (
    <>
      <ModelsController visibility={isOpen} transformEffect={true} windowScroll={false}>
        <div className={`w-full h-full fixed top-0 left-0 flex justify-center sm-screen:items-end items-center ${message === "Success" ? "px-2.5" : "px-0"} bg-gray-950 bg-opacity-50 z-[60]`}
          style={{ transform: 'translateY(100%)' }}
        >

          <div className={`sm-screen:w-full w-auto max-w-md mx-4 ${message !== "Success" ? "sm-screen:absolute z-20 sm-screen:bottom-0 sm-screen:rounded-b-none" : "max-w-[fit-content]"} sm-screen:m-auto w-auto h-fit rounded-lg sm-screen:rounded-xl bg-white p-4 shadow-2xl border border-gray-300`}>

            {message !== 'Success' ? (
              <>
                <div className="space-y-2 mb-4 max-w-sm">
                  <h2 className="text-base font-bold leading-4">Are you sure you want to report?</h2>
                  <p className="mt-2 text-xs text-gray-600 font-medium">
                    Please select or describe your issue. We try to fix problems in 14 to 24 hours. Sometimes it may take longer, so please wait patiently.
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

                {/* Email input + Save checkbox */}
                <div className="my-3">
                  <label htmlFor="userEmail" className="block mb-1 text-sm font-semibold text-gray-900">
                    Your Email (optional)
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter email to receive update (optional)"
                    className="block w-full p-2.5 text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300"
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveEmail"
                      checked={saveEmail}
                      onChange={(e) => setSaveEmail(e.target.checked)}
                      className="w-4 h-4 cursor-pointer text-blue-600 bg-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <label htmlFor="saveEmail" className="text-xs font-medium text-gray-700">
                      Save this email for next time
                    </label>
                  </div>
                </div>

                {message !== "Success" && message !== "Pending" && (
                  <div className="my-1 max-w-sm">
                    <p className="text-red-pure text-xs font-medium">{message}</p>
                  </div>
                )}
                <div className="py-1 flex gap-5 mobile:my-3">
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
              <div className="flex flex-col items-center justify-center space-y-3 py-6 px-1.5 relative">
                <button
                  onClick={() => closeModel()}
                  type="button"
                  className="bg-gray-400 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-400 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-2 right-3"
                  aria-label="Close"
                >
                  <i className="bi bi-x-lg text-base"></i>
                </button>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="max-w-xs text-gray-600 text-center text-base font-bold">
                  {"Thank you for reporting. We’ll try to fix the problem within 14 to 24 hours if we find any issue. It may take longer if the problem is big or many others are reporting."}
                </h2>
                {!isContentSaved ? (
                  <>
                    <p className="text-gray-800 text-sm text-center font-semibold">
                      Want to easily check later if this issue is resolved? Save this content in your <strong>Watch Later</strong> list.
                    </p>
                    <button
                      onClick={handleSaveContent}
                      className="mt-3 px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all duration-300 text-white text-sm font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 inline-flex items-center gap-2"
                    >
                      <svg fill="#d1d5db" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
                        <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path>
                      </svg> <span>Save for Easy Access</span>
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-green-700 text-sm text-center font-medium">
                      ✅ This content has been saved to your Watch Later. You can check it anytime in your <strong>Watch Later</strong> list for easy access in the future.
                    </p>
                    <p className="text-gray-600 text-xs text-center font-medium mt-1">
                      📌 You can find the <strong>Watch Later</strong> option at the top right corner of our homepage.
                    </p>
                  </>
                )}

              </div>
            )}
          </div>

        </div>

      </ModelsController>

      <ModelsController visibility={serverSuggestion.isModelOpen} windowScroll={false}>
        <div className="fixed inset-0 z-[62] bg-black/60 flex justify-center items-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-2.5 space-y-6 pb-4">

            {/* Header */}
            <div className="flex items-start gap-4">
              <i className="bi bi-exclamation-triangle-fill text-red-600 text-3xl mt-1"></i>
              <div className="text-lg font-semibold text-gray-900">Please Confirm</div>
            </div>

            {/* Description */}
            <div className="text-gray-700 text-sm leading-relaxed space-y-2 font-medium px-2">
              {!isOnlyRpmPlaySource && (
                <p>
                  Before reporting a video issue, we recommend trying the content on all suggested servers. If none of the options work, please proceed to report the problem.
                </p>
              )}

              {rpmShareSourceIndex !== -1 && (
                <p className="text-gray-600">
                  If the video is not playing on server <strong className="text-blue-700">{rpmShareSourceIndex + 1}</strong>, please try playing it 3/4 times. It may take up to 30 seconds to load, so we recommend waiting patiently during that time
                </p>
              )}
            </div>

            {/* Buttons */}
            {/* Server Buttons */}
            <div className={`grid mobile:grid-cols-1 grid-cols-2 gap-3 w-full max-w-3xl mx-auto ${serverSuggestion?.serversData?.length > 4 ? "mobile:max-h-56 max-h-full mobile:overflow-y-scroll overflow-y-auto" : ""}`}>
              {serverSuggestion.serversData?.map(({ source, label, labelTag }, index) => (
                <button
                  key={index}
                  onClick={() => playAlterNativeServer(source)}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md text-center break-words whitespace-normal leading-snug"
                >
                  {labelTag}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setServerSuggestion({
                  isModelOpen: false,
                  want_report: false,
                  serversData: null,
                })
              }
              className="bg-gray-800 block ml-auto mr-auto hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm"
            >
              No, I will report it
            </button>
          </div>
        </div>

      </ModelsController>
    </>
  );

};