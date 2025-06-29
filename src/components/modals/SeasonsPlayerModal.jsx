'use client';

//import { ModelsController } from '@/lib/EventsHandler';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

export default function SeasonsPlayerModal({ visible, onClose, seriesData, playHandler }) {

    const [selectedLang, setSelectedLang] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);


    const currentLangObj = seriesData?.find(
        (lang) => lang.language === selectedLang
    );

    const seasons = currentLangObj?.seasons || [];
    const episodes = selectedSeason
        ? seasons.find((s) => s.seasonNumber === selectedSeason)?.episodes || []
        : [];

    return (

        <AnimatePresence>
            {visible && (
                     <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center px-3 bg-black/70 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-[#212021] text-white rounded-2xl shadow-lg p-6 max-w-md w-full relative"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Playback Options</h2>
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="bg-gray-600 text-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-2 right-3"
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg text-base"></i>
                                </button>
                            </div>

                            {/* Language */}
                            <div className="mb-4">
                                <p className="text-sm font-semibold mb-2 text-gray-300">Language</p>
                                <div className="flex flex-wrap gap-2">
                                    {seriesData?.map((langObj) => (
                                        <button
                                            key={langObj.language}
                                            onClick={() => {
                                                setSelectedLang(langObj.language);
                                                setSelectedSeason(langObj.seasons?.[0]?.seasonNumber || null);
                                            }}
                                            className={`px-3 py-1 rounded text-sm font-medium border transition ${selectedLang === langObj.language
                                                    ? "bg-teal-600 border-teal-500"
                                                    : "bg-zinc-800 border-gray-700 hover:bg-zinc-700"
                                                }`}
                                        >
                                            {langObj.language}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Season */}
                            {selectedLang && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold mb-2 text-gray-300">Season</p>
                                    <div className="flex flex-wrap gap-2">
                                        {seasons.map((season) => (
                                            <button
                                                key={season.seasonNumber}
                                                onClick={() => setSelectedSeason(season.seasonNumber)}
                                                className={`px-3 py-1 rounded text-sm font-medium border transition ${selectedSeason === season.seasonNumber
                                                        ? "bg-teal-600 border-teal-500"
                                                        : "bg-zinc-800 border-gray-700 hover:bg-zinc-700"
                                                    }`}
                                            >
                                                S{season.seasonNumber}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Episodes */}
                            {selectedSeason && (
                                <div>
                                    <p className="text-sm font-semibold mb-2 text-gray-300">Episodes</p>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                        {episodes.map((episodeSource, index) => (
                                            <button
                                                key={"episode" + index}
                                                onClick={() => {
                                                    let source = episodeSource;
                                                    onClose();
                                                    const cdnBasePath = seasons[selectedSeason - 1]?.basePath

                                                    if (cdnBasePath) {
                                                        source = cdnBasePath + episodeSource

                                                    }
                                                    playHandler(source);
                                                }}
                                                className="w-full px-4 py-2 bg-zinc-800 hover:bg-teal-700 rounded text-left transition"
                                            >
                                                S{selectedSeason} - Episode {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
            )}
        </AnimatePresence>
    );
}
