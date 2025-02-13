"use client"

import { appConfig } from "@/config/config";
import { useCurrentWindowSize } from "@/hooks/hook";
import { ModelsController } from "@/lib/EventsHandler"
import { creatToastAlert } from "@/utils";
import axios from "axios";
import { useState } from "react";
import FullScreenBackdropLoading from "../loadings/BackdropLoading";

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

export default function DownloadOptionModel({ isOnline, imdbId, linksData, isOpen, onClose, onReportButtonClick }) {

  const { title, links, qualityType } = linksData || {};

  // get window live current width 
  const windowCurrentWidth = useCurrentWindowSize().width;

  //const [downloadOptionUrlData, setDownloadOptionUrlData] = useState([]);
  const [downloadStartProgress, setDownloadStartProgress] = useState(false);

  const handleDownload = async (sourceIndex) => {
    try {

      if (!isOnline) {
        creatToastAlert({
          message: 'You are offline. Please check your internet connection.',
        });
        return;
      };
      // Set the loading state
      setDownloadStartProgress(true);

      // Fetch the HTML content from the URL
      const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/download_urls/${imdbId?.replace('tt', '')}?sourceIndex=${sourceIndex}`);

      if (response.status !== 200) {
        creatToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visiblityTime: 12000
        });             
        return;
      };

      const { downloadUrl } = response.data || {};

      if (!downloadUrl) {
        creatToastAlert({
          message: 'Download failed. Please try again later, or report the issue to us.',
          visiblityTime: 12000
        });        
        
        return;
      };

      // Start the download
      window.open(downloadUrl, '_blank', 'noopener,noreferrer'); // Open the ad link

    } catch (error) {
      console.error('Error fetching download option URLs:', error);
      creatToastAlert({
        message: 'Download failed. Please try again later, or report the issue to us.',
        visiblityTime: 12000
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
      <ModelsController visibility={isOpen} windowScroll={false} transformEffect={windowCurrentWidth <= 450}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center sm-screen:items-end justify-center z-50">

          <div className="bg-white rounded-lg sm-screen:rounded-xl sm-screen:rounded-b-none sm-screen:w-full max-w-[450px] shadow-lg py-2">
            <div className="flex justify-around">
              <div className="text-lg font-bold my-3 mx-3 text-black">Download Options</div>
              <button type="button"
                onClick={onReportButtonClick}
                className="bg-transparent outline-none text-sm font-semibold text-gray-800 px-2">
                Report
              </button>
            </div>

            <div className="px-5">
              {/* Title */}
              <div className="text-sm text-gray-700 font-bold text-center my-2.5 line-clamp-2">{title}</div>
              {/* Download Links */}
              <div className="space-y-2 max-w-sm mx-auto">
                {links.map(({ quality, size }, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleDownload(index)}
                    className="block w-full text-sm text-cyan-900 hover:text-cyan-800 font-semibold px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md transition"
                  >
                    <span>{quality} - {size}</span>
                    <span className="ml-1.5 capitalize text-gray-800">{formatQualityType(quality, qualityType)}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-1 font-medium text-xs text-gray-500">
                <p className="text-center">
                  After clicking the download option, please don&lsquo;t close the opend window; your download will start shortly and automatically.
                </p>
                <p className="text-center">
                  If the download not start after click, wait a few minutes and try again. You can also try a different download option or watch online if needed.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full mb-4 mt-7 bg-gray-900 hover:bg-gray-950 text-gray-50 py-2 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ModelsController>

      <FullScreenBackdropLoading
        isLoading={downloadStartProgress}
        loadingMessage="Starting download... Please wait"
      />
    </>
  )
}
