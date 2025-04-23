"use client"

import { motion } from "framer-motion";

export default function LoadContentError({ errorDescription, customRefreshFunction, customRefreshTitle }) {

    const handleEmail = () => {
        const email = 'moviesbazarorg@gmail.com';
        const reportSubject = "Issue Encountered on MoviesBazar";
        const reportMessage = `Hello MoviesBazar Team,\n\nI am experiencing an error while exploring the site. The error occurred on the following page: ${window.location.href}.\n\nThank you for your assistance!`;
        // Encode the subject and body to ensure proper formatting in the email client
        const encodedSubject = encodeURIComponent(reportSubject);
        const encodedBody = encodeURIComponent(reportMessage);

        window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    };
    return (
        <div className="w-full min-h-[70vh] bg-custom-dark-bg flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-md w-full bg-[#1f1f1f] text-white rounded-2xl p-6 shadow-xl border border-gray-700 text-center"
            >

                <div className="text-2xl sm-screen:text-xl font-bold mb-2">Something Went Wrong</div>
                <p className="text-gray-400 text-sm mb-6">
                    {errorDescription ? errorDescription : "We could't load the movies right now. Please try refreshing the page or come back later."}
                </p>
                <div className="w-full h-auto flex justify-center flex-wrap items-center gap-5 mb-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (customRefreshFunction && typeof customRefreshFunction === "function") {
                                customRefreshFunction()
                            } else {
                                window.location.reload()
                            }
                        }
                        }
                        type="button"
                        className="px-5 py-2.5 rounded-xl sm-screen:text-sm bg-teal-700 hover:bg-teal-600 text-white font-medium text-sm shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 inline-flex items-center gap-2"
                    >
                        <i className="bi bi-arrow-clockwise text-base"></i>
                        <span>{customRefreshTitle ? customRefreshTitle : "Reload Page"}</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEmail()}
                        type="button"
                        className="px-5 py-2.5 rounded-xl sm-screen:text-sm bg-slate-600 hover:bg-slate-700 bg-opacity-20 text-slate-200 font-medium text-sm shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 inline-flex items-center gap-2"
                    >
                        <i className="bi bi-bug text-base"></i>
                        <span>Report Us</span>
                    </motion.button>
                </div>

            </motion.div>

        </div>
    );
}
