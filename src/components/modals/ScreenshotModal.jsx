"use client";

import { motion, AnimatePresence } from "framer-motion";

const ScreenshotModal = ({ src, quality, fileName, onClose }) => {

  // Remove the canvas element if it exists
  // This is to ensure that the canvas does not persist after the modal is closed

  const removeCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.remove();
    }
  };

  if (!src) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-gray-800 text-gray-100 rounded-2xl p-5 shadow-2xl w-full max-w-md relative"
        >
          <h2 className="text-lg font-bold text-center text-gray-200 mb-4">
            Screenshot Preview
          </h2>

          <img
            src={src}
            alt="Screenshot"
            className="w-full rounded-lg border border-gray-700 mb-4 select-none pointer-events-none"
          />

          {quality && (
            <p className="text-sm text-center text-gray-200 font-medium mb-4">
              Quality: <span className="font-semibold text-gray-300">{quality}</span>
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = src;
                link.download = `${fileName}-${quality}_Screenshot-${Date.now()}.jpeg`;
                link.click();
              }}
              className="flex-1 bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-500 text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              Download
            </button>

            <button
              onClick={() => {
                onClose();
                removeCanvas();
              }}
              className="flex-1 bg-gray-900 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScreenshotModal;
