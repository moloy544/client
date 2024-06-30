import { ModelsController } from "@/lib/EventsHandler";
import { useRef, useState } from "react";

export default function ReportModel({ movieData, setIsModelOpen, isOpen }) {

    const [selectedReports, setSelectedReports] = useState([]);
    const [message, setMessage] = useState("Pending");
  
    const writtenReportRef = useRef(null);
  
    const closeModel = () => {
  
      const body = document.querySelector('body');
  
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
     
      body.removeAttribute('class', 'scrollbar-hidden');
  
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
      <ModelsController visibility={isOpen}>
        <div className="w-full h-full fixed top-0 left-0 z flex justify-center items-center bg-gray-950 bg-opacity-50 z-[300]">
          <div className="mobile:w-[90%] mx-4 max-w-sm mobile:m-auto w-auto h-auto rounded-lg bg-white p-4 shadow-2xl border border-gray-300">
  
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
                  <p className="text-red-pure text-xs my-1">Please select or describe your problem  minimum 8 words</p>
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
        </div>
      </ModelsController>
    );
  
  };
  
  