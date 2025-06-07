import { handleEmailUs } from "@/helper/helper";
import { ModelsController } from "@/lib/EventsHandler";
import Image from "next/image";

const primaryPlayerImageGuidedata = [
    {
        title: "Language Selection",
        description: "Tap the language option in the player to choose your preferred language.",
    },
    {
        title: "Select Audio Track",
        description: "Choose your desired audio track from the list of available tracks.",
    },
    {
        title: "Change Video Quality",
        description: "Tap the quality option to select the video resolution for the best experience.",
    },
    {
        title: "Adjust Playback Speed",
        description: "Tap the speed option to make the video play faster or slower.",
    },
    {
        title: "Fit Video to Screen",
        description: "Tap the Scale option to adjust the video size. Use the -5% option to zoom out and +5% to zoom in. This helps you fit the video properly on your mobile screen. 100% option for original size.",
    },
    
    {
        title: "Skip Playback by 10 Seconds",
        description: "Double tap on the right side to skip forward 10 seconds, or or double tap on the left side to go 10 seconds back."
    },
];

const secondaryPlayerImageGuidedata = [
    {
        title: "Open Settings",
        description: "Tap the settings icon in the video player.",
    },
    {
        title: "Go to Audio Options",
        description: "Select the audio section from the settings menu.",
    },
    {
        title: "View Available Tracks",
        description: "Tap the track option to see all available audio tracks.",
    },
    {
        title: "Change Audio Track",
        description: "Choose a different audio track from the list.",
    },
    {
        title: "Boost Audio Volume",
        description: "Increase the audio volume by adjusting the percentage level.",
    },
];

const secondary2PlayerImageGuidedata = [
    {
        title: "Open Settings",
        description: "Tap the settings icon on the video player screen.",
    },
    {
        title: "Go to Audio Options",
        description: "Tap the audio icon to see all available languages.",
    },
    {
        title: "Select Audio Track",
        description: "Pick your preferred language from the list.",
    },
    {
        title: "Change Video Quality",
        description: "Tap the quality option to adjust video resolution.",
    },
];

export function PlayerGuideModal({ isOpen, handleClose, guidePlayerIndex = 1 }) {

    return (
        <ModelsController
            visibility={isOpen}
            windowScroll={false}
            transformEffect={true}
        >
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center sm-screen:items-end justify-center z-50 lg:py-4">
                <div className="bg-white max-h-full overflow-y-scroll scrollbar-hidden rounded-lg sm-screen:rounded-xl sm-screen:rounded-b-none sm-screen:w-full max-w-[450px] shadow-lg relative">

                    <div className="sticky top-0 bg-white pt-2 px-4">
                        <h2 className="text-xl font-semibold text-center text-gray-900">
                            <i className="bi bi-book-fill"></i> Primary & Secondary Player Guide
                        </h2>
                        <p className="font-medium text-center text-sm text-gray-600 mt-2">
                            Please scroll down completely to view all the guide instructions.
                        </p>
                    </div>

                    <div className="p-4 pb-7 space-y-4">
                        <div className={guidePlayerIndex === 1 ? "flex flex-col" : "flex flex-col-reverse"}>
                            <section className="w-full px-2">
                                <strong className="text-blue-950 font-bold">Primary Player Guide:</strong>

                                <p className="text-gray-800 text-sm my-2 font-medium">
                                    For changing language, quality, speed, or adjusting the video size.
                                </p>

                                <div className="grid grid-cols-1 space-y-6 items-center">
                                    {primaryPlayerImageGuidedata.map(({ title, description }, index) => (
                                        <div
                                            className="w-auto flex items-center justify-center flex-col spacey-3"
                                            key={index}
                                        >
                                            <Image
                                                className="w-full h-auto"
                                                src={require(`@/assets/images/primary-player-image-${index + 1}.png`)}
                                                alt={`Primary Player Guide - ${title}`}
                                            />
                                            <h4 className="text-base text-gray-800 font-semibold">{title}</h4>
                                            <p className="text-sm text-gray-700 font-medium">{description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="w-full px-2 my-2.5">
                                <strong className="text-blue-950 font-bold">Secondary Player Guide:</strong>
                                <p className="text-gray-800 text-sm my-2 font-medium">
                                    For changing language, audio track, and sound settings.
                                </p>

                                <div className="grid grid-cols-1 space-y-6 items-center mt-4">
                                    {secondaryPlayerImageGuidedata.map(({ title, description }, index) => (
                                        <div
                                            className="w-auto flex items-center justify-center flex-col spacey-3"
                                            key={index}
                                        >
                                            <Image
                                                src={require(`@/assets/images/secondary-player-image-${index + 1}.png`)}
                                                alt={`Secondary Player Guide - ${title}`}
                                            />
                                            <h4 className="text-base text-gray-800 font-semibold">{title}</h4>
                                            <p className="text-sm text-gray-700 font-medium">{description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 space-y-6 items-center mt-4">
                                    {secondary2PlayerImageGuidedata.map(({ title, description }, index) => (
                                        <div
                                            className="w-auto flex items-center justify-center flex-col spacey-3"
                                            key={index}
                                        >
                                            <Image
                                                src={require(`@/assets/images/3rd-player-image-${index + 1}.png`)}
                                                alt={`3rd Player Guide - ${title}`}
                                            />
                                            <h4 className="text-base text-gray-800 font-semibold">{title}</h4>
                                            <p className="text-sm text-gray-700 font-medium">{description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <p className="text-sm text-gray-600 text-center font-medium">
                            Having trouble? Feel free to email us at{" "}
                            <span
                                onClick={handleEmailUs}
                                className="text-blue-500 font-semibold cursor-pointer"
                            >
                                moviesbazarorg@gmail.com
                            </span>
                        </p>
                    </div>

                    <div className="bg-white w-full sticky bottom-0 pb-4 pt-4 justify-center items-center flex">
                        <button
                            onClick={handleClose}
                            className="w-[80%] bg-gray-900 hover:bg-gray-950 text-gray-50 py-2 rounded-md transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </ModelsController>
    );
}
