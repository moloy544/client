"use client"

import { useWindowWidth } from "@/hooks/hook";
import { ModelsController } from "@/lib/EventsHandler"

const formatQualityType = (quality, qualityType) => {

  if (qualityType.toLowerCase() === "cam") return `(${qualityType})`

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
    default:
      qualityLabel = 'Standard';
      break;
  }

  // Format as "quality (Label)"
  return `(${qualityLabel})`;
};

export default function DownloadOptionModel({ linksData, isOpen, onClose }) {

  const { title, links, qualityType } = linksData || {};
   
  // get window live current width 
  const windowCurrentWidth = useWindowWidth();
  
  const handleDownload = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer'); // Open the download link
  };

  // validate if false anything returns nothing
  if (!links || !Array.isArray(links) || links.length === 0) {
    return null
  }

  return (
     <ModelsController visibility={isOpen} windowScroll={false} transformEffect={windowCurrentWidth <= 450}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center sm-screen:items-end justify-center z-50 mx-1.5">

          <div className="bg-white rounded-lg sm-screen:w-full max-w-[500px] shadow-lg py-2">

            <div className="text-lg font-bold my-3 mx-3 text-black">Download Options</div>

            <div className="px-5">
              {/* Title */}
              <div className="text-sm text-gray-700 font-bold text-center my-2.5">{title}</div>
              {/* Download Links */}
              <div className="space-y-2">
                {links.map(({ quality, size, url }, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleDownload(url)}
                    className="block w-full text-sm text-cyan-900 hover:text-gray-700 font-semibold px-4 py-2 bg-slate-200 hover:bg-gray-300 rounded-md transition"
                  >
                    <span>{quality} - {size}</span>
                    <span className="ml-1.5 capitalize">{formatQualityType(quality, qualityType)}</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-medium text-gray-500 mt-2">If download speed slow or not work then please stream online.</p>
              {/* Close Button */}
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
  )
}
