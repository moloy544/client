'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { appConfig } from "@/config/config";
import brandLogoIcon from "../../assets/images/brand_logo.png";
import { useRouter } from "next/navigation";
import { createToastAlert, creatUrlLink, resizeImage, transformToCapitalize } from "@/utils";
import { handleEmailUs } from "@/helper/helper";
import FullScreenBackdropLoading from "@/components/loadings/BackdropLoading";

const api = axios.create({
    baseURL: appConfig.backendUrl,
    withCredentials: true
});

export default function DmcaAdminDashboard({ companyData }) {
    const [urlInput, setUrlInput] = useState("");
    const [movieData, setMovieData] = useState(null);
    const [status, setStatus] = useState("idle");
    const [successMsg, setSuccessMsg] = useState("");
    const [page, setPage] = useState(1); // starts at 1
    const [endOfData, setEndOfData] = useState(false);
    const [takedownList, setTakedownList] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [process, setProcess] = useState(false);
    const [backdropMessage, setBackDropMessage] = useState(null);
    const [isToggleBlocked, setIsToggleBlocked] = useState(false);
    const [blockMessage, setBlockMessage] = useState("");


    const router = useRouter();
    const isTakeDownLoadedRef = useRef(false); // default false

    const fetchTakedowns = async (pageNumber = 1) => {
        try {
            setIsLoadingHistory(true);
            const skip = (pageNumber - 1) * 50;

            const res = await api.get(`/api/v1/dmca-admin/get/takedowns?skip=${skip}`);
            if (res.status === 200) {
                setTakedownList(res.data.takedownHistories || []);
                setEndOfData(res.data.endOfData || false); // this must come from backend
                setPage(pageNumber);
            }
        } catch (err) {
            console.error("Failed to fetch takedowns", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };


    const handleCheck = async () => {
        const imdbId = urlInput.trim().split("/").pop();
        if (!imdbId || imdbId.length < 5) {
            setStatus("invalid");
            return;
        }
        try {

            if (movieData && movieData.contentId === imdbId) {
                createToastAlert({
                    message: "Preview already available.",
                });

                return

            }
            setStatus("loading");
            const res = await api.get(`/api/v1/dmca-admin/preview/${imdbId}`);
            if (res.status === 200 && res.data?.contentData) {
                setMovieData(res.data.contentData);
                setStatus("success");
                setSuccessMsg("");
            } else {
                setStatus("invalid");
                setMovieData(null);
            }
        } catch (err) {
            console.error(err);
            setStatus("invalid");
            setMovieData(null);
        }
    };

    const handleTakedown = async () => {
        const imdbId = urlInput.trim().split("/").pop();
        try {
            const isAlredyTakeDown = movieData.disabled;
            if (isAlredyTakeDown) {
                createToastAlert({
                    message: "⚠️ This content has already been taken down and is currently disabled."
                });
                return
            }
            setProcess(true);
            const res = await api.post(`${appConfig.backendUrl}/api/v1/dmca-admin/action/takedown`, {
                content: imdbId,
                disabled: true,
            });

            if (res.status === 200 && res.data?.takedownRecord) {
                setSuccessMsg("✅ Takedown completed successfully.");
                setTimeout(() => setSuccessMsg(""), 4000);

                setMovieData(null);
                setStatus("idle");
                setUrlInput("");

                const newRecord = res.data.takedownRecord;

                // Safely update the list with new takedown record
                setTakedownList((prevList) => {
                    const index = prevList.findIndex(item => item.contentId === newRecord.contentId);

                    if (index === -1) {
                        // Not in the list add it at the top
                        return [newRecord, ...prevList];
                    }

                    const existingItem = prevList[index];

                    // Already exists, but may not be disabled yet — update it if needed
                    if (existingItem && !existingItem.disabled) {
                        const updatedItem = { ...existingItem, disabled: true };
                        const updatedList = [...prevList];
                        updatedList[index] = updatedItem;
                        return updatedList;
                    }

                    // No changes needed
                    return prevList;
                });

            } else {
                createToastAlert({ message: "Takedown failed. Please try again." });
            }
        } catch (err) {
            console.error(err);
            createToastAlert({ message: "Failed to send takedown." });
        } finally {
            setProcess(false)
        }
    };

    const handleLogout = async () => {
        try {
            const res = await api.post('/api/v1/dmca-admin/logout');
            if (res.status === 200) router.push('/dmca-admin/login');
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle update for content disabled and enabled
    const handleToggleStatus = async (contentId, preview = false) => {
        // Global toggle block
        if (isToggleBlocked) {
            setBlockMessage("⚠️ Too many actions! Please wait a few seconds.");
            setTimeout(() => setBlockMessage(""), 3000); // Message auto-hide
            return;
        }

        setIsToggleBlocked(true); // Start cooldown
        setTimeout(() => setIsToggleBlocked(false), 4000); // Cooldown duration

        try {
            const content = preview
                ? movieData
                : takedownList.find((item) => item.contentId === contentId);

            if (!content) return;

            setBackDropMessage(
                `${content.disabled ? "Enabling access. Please wait..." : "Disabling access. Please wait..."}`
            );

            const res = await api.post(
                `${appConfig.backendUrl}/api/v1/dmca-admin/action/toggle`,
                {
                    contentId,
                    disabled: !content.disabled,
                    previewItemUpdate: preview,
                }
            );

            if (res.status === 200) {
                const newDisabledState = !content.disabled;

                setMovieData((prev) => {
                    if (!prev || prev.contentId !== contentId) return prev;
                    return { ...prev, disabled: newDisabledState };
                });

                setTakedownList((prevList) =>
                    prevList.map((item) =>
                        item.contentId === contentId
                            ? { ...item, disabled: newDisabledState }
                            : item
                    )
                );

                createToastAlert({
                    message: `Content access is now ${content.disabled ? 'Enabled' : 'Disabled'}`,
                    visibilityTime: 3000
                });

            } else {
                createToastAlert({ message: "Update failed. Try again." });
            }
        } catch (err) {
            console.error("Toggle error:", err);
            createToastAlert({ message: "Error updating content status." });
        } finally {
            setBackDropMessage(null);
        }
    };


    // Load Takedowns History 
    useEffect(() => {
        if (!isTakeDownLoadedRef.current) {
            isTakeDownLoadedRef.current = true; // ✅ lock set BEFORE calling fetch
            fetchTakedowns(1);
        }

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 mobile:py-1 px-4 mobile:px-1">
            {blockMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{
                        duration: 0.4,
                        type: "spring",
                        bounce: 0.4,
                    }}
                    className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-sm font-semibold shadow-md mb-4 text-center"
                >
                    ⚠️ {blockMessage}
                </motion.div>
            )}

            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg space-y-8">
                <div className="p-6 mobile:p-3 bg-white rounded-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            <Image src={brandLogoIcon} alt="Logo" width={80} height={80} className="rounded-md w-16 h-16 mobile:w-14 mobile:h-14" />
                            <div className="flex flex-col">
                                <h1 className="text-xl mobile:text-base font-bold text-gray-800">DMCA Panel</h1>
                                <p className="font-semibold mobile:text-xs text-sm text-yellow-700">{companyData.company} Team</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:underline">Logout</button>
                    </div>

                    {/* Input */}
                    <div>
                        <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">Enter infringing URL:</label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                id="url"
                                type="text"
                                placeholder={`e.g. ${appConfig.appDomain}/watch/type/name/12345`}
                                value={urlInput}
                                onChange={(e) => {
                                    const value = e.target.value?.split('?')[0].split('#')[0];
                                    setUrlInput(value);

                                    // Only clear error once user types
                                    if (status !== "idle" && status !== "success") {
                                        setStatus("idle");
                                    }
                                }}

                                autoComplete="off"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                            <button
                                onClick={handleCheck}
                                className="w-full sm:w-fit text-sm px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold"
                            >
                                Check
                            </button>
                        </div>
                    </div>

                    {/* Feedback / Preview */}
                    <div>
                        {status === "loading" && <p className="text-blue-600 font-medium text-center my-10">Checking preview...</p>}

                        {status === "invalid" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-600 font-medium text-base mobile:text-sm mt-2"
                            >
                                Content not found or unavailable. Please check the link.
                                For help, contact <span onClick={handleEmailUs} className="text-blue-600 underline cursor-pointer ml-1">moviesbazarorg@gmail.com</span>.
                            </motion.div>
                        )}

                        {movieData && status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="mt-6 rounded-2xl border border-green-300 bg-green-50/80 shadow-md backdrop-blur-sm p-6 sm:p-5"
                            >
                                {/* Header */}
                                <h2 className="text-xl font-bold text-green-800 flex items-center gap-2 mb-4">
                                    ✅ Preview Found
                                    <span className="text-sm font-medium text-green-600">(Verified)</span>
                                </h2>

                                {/* Layout */}
                                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                    {/* Thumbnail and View */}
                                    <div className="flex flex-col items-center gap-2">
                                        <img
                                            src={resizeImage(movieData.thumbnail.replace('mbcdn.net', 'tmdb.org'))}
                                            alt="Preview"
                                            className="w-28 h-40 object-cover rounded-lg border border-gray-300 shadow-sm select-none"
                                        />

                                        <a
                                            href={`/watch/${movieData.type}/${creatUrlLink(movieData.title)}/${movieData.contentId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 hover:scale-105 transition duration-200 ease-out"
                                        >
                                            <i className="bi bi-eye-fill" /> View
                                        </a>
                                    </div>

                                    {/* Movie Info */}
                                    <div className="space-y-2 text-sm text-gray-700 font-medium max-w-lg">
                                        <p><span className="font-semibold text-gray-900">Title:</span> {movieData.title}</p>
                                        <p><span className="font-semibold text-gray-900">Release Year:</span> {movieData.releaseYear || 'N/A'}</p>
                                        <p><span className="font-semibold text-gray-900">Type:</span> {movieData.type || 'N/A'}</p>

                                        <p className={`flex items-center gap-1 font-semibold ${movieData.disabled ? "text-red-700" : "text-green-600"}`}>
                                            <i className={`bi ${movieData.disabled ? "bi-x-circle-fill" : "bi-check-circle-fill"}`} />
                                            {movieData.disabled ? "Disabled" : "Active"}
                                        </p>

                                        {movieData.disabled && movieData.isTakedownByYou && (
                                            <div className="flex items-center gap-2 pt-2">
                                                <span className="text-xs font-medium text-gray-600">Toggle Access</span>
                                                <button
                                                    onClick={() => handleToggleStatus(movieData.contentId, true)}
                                                    className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${movieData.disabled ? "bg-green-500" : "bg-red-500"}`}
                                                    title={movieData.disabled ? "Enable Content" : "Disable Again"}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${movieData.disabled ? "translate-x-5" : "translate-x-1"}`}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Note or Takedown Button */}
                                {movieData.disabled ? (
                                    <div className="mt-5 w-full px-4 py-2 rounded-md border text-sm font-medium text-center border-yellow-300 bg-yellow-50 text-yellow-900">
                                        ⚠️ This content has already been taken down and is currently disabled by
                                        {movieData.isTakedownByYou ? " your company." : " a different company."}
                                    </div>
                                ) : (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={handleTakedown}
                                            className="w-full max-w-sm h-10 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-all duration-200"
                                        >
                                            {!process ? "🚫 Confirm Takedown" : <div className="three_dots_loading w-2 h-2 justify-self-center"></div>}
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                        )}

                        {!movieData && status === "idle" && (
                            <div className="mt-4 border border-green-200 rounded-xl p-4 bg-green-50 shadow-sm">
                                <h4 className="text-base mobile:text-xs font-semibold text-gray-800 text-center">
                                    Preview will appear here if content is found after checking the infringement URL.
                                </h4>
                            </div>
                        )}
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md shadow-sm"
                            >
                                {successMsg}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Takedown History */}
                <div className="mt-8 px-3">
                    <h2 className="text-lg mobile:text-base font-bold text-gray-800 mb-3">📋 Takedown History</h2>

                    {isLoadingHistory ? (
                        <div className="text-blue-600 text-base mobile:text-sm font-medium animate-pulse text-center">
                            Loading takedown history...
                        </div>
                    ) : takedownList.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center my-10 font-semibold">No takedown actions yet.</p>
                    ) : (
                        <>
                            <div className="max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                <div className="w-auto h-fit gap-2.5 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] px-2.5 py-2 bg-blue-50">
                                    {takedownList.map((item) => (
                                        <div
                                            key={item.contentId}
                                            className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm overflow-hidden max-w-sm"
                                        >
                                            <div className="relative group w-20 h-28 rounded-md overflow-hidden border cursor-pointer flex-none">
                                                <a
                                                    href={`/watch/${item.type}/${creatUrlLink(item.title)}/${item.contentId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full h-full"
                                                >
                                                    <Image
                                                        width={110}
                                                        height={110}
                                                        src={resizeImage(item.thumbnail.replace("mbcdn.net", "tmdb.org"))}
                                                        alt={`${item.title} Poster`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <i className="bi bi-eye text-white text-xl"></i>
                                                    </div>
                                                </a>
                                            </div>

                                            <div className="flex flex-col justify-between text-sm mobile:text-xs text-gray-700">
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-gray-900 w-auto line-clamp-2">{item.title}</p>
                                                    <p>Year: {item.releaseYear}</p>
                                                    <p>Type: {transformToCapitalize(item.type)}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Takedown:{" "}
                                                        {new Date(item.createdAt).toLocaleString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true,
                                                        })}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
    ${item.disabled ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                                                        >
                                                            <span
                                                                className={`w-2 h-2 rounded-full ${item.disabled ? "bg-red-500" : "bg-green-500"}`}
                                                            ></span>
                                                            {item.disabled ? "Disabled" : "Active"}
                                                        </span>

                                                        <button
                                                            onClick={() => handleToggleStatus(item.contentId, false)}
                                                            disabled={isToggleBlocked}
                                                            className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none 
    ${item.disabled ? "bg-green-500" : "bg-red-500"} 
    ${isToggleBlocked ? "opacity-50 cursor-not-allowed" : ""}
  `}
                                                            title={item.disabled ? "Enable Content" : "Disable Again"}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 
      ${item.disabled ? "translate-x-5" : "translate-x-1"}
    `}
                                                            />
                                                        </button>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                {endOfData && (
                                    <p className="text-center text-sm text-gray-600 font-medium my-3">
                                        No more records available.
                                    </p>

                                )}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-4 px-2 text-sm font-medium">
                                <button
                                    onClick={() => fetchTakedowns(page - 1)}
                                    disabled={page === 1}
                                    className={`px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-800 disabled:opacity-40`}
                                >
                                    ← Prev
                                </button>

                                <span className="text-gray-700">Page {page}</span>

                                <button
                                    onClick={() => fetchTakedowns(page + 1)}
                                    disabled={endOfData}
                                    className={`px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-800 disabled:opacity-40`}
                                >
                                    Next →
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/*** Footer Section Credit Details and Contact Us */}
                <div className="mt-3 border-t text-center text-sm text-gray-500 px-2.5 py-3.5 space-y-2">
                    <p>For any queries, please contact us at <span onClick={handleEmailUs} className="text-blue-600 underline cursor-pointer">moviesbazarorg@gmail.com</span>.</p>
                    <p>Built and maintained by <a className="text-gray-800 font-semibold" href="https://www.facebook.com/sanjoy.rokshit.5" title="Facebook Contact" target="_blank" rel="noopener noreferrer">Sanjoy Rakshit</a></p>
                </div>

            </div>

            {backdropMessage && (
                <FullScreenBackdropLoading
                    loadingSpinner={true}
                    loadingMessage={backdropMessage}
                />
            )}

        </div>
    );
}