"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import useOnlineStatus from "@/lib/lib";
import { useOrientation } from "@/hooks/hook";

function generateSourceURL(originalURL, userIp) {
    if (!originalURL) return "";

    if (!originalURL.includes("ooat310wind.com")) return originalURL;

    const expirationTimestamp = Math.floor(Date.now() / 1000) + 10 * 60 * 60;
    const modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);
    return modifiedURL;
};

const isMobileDevice = () => {
    if (navigator.userAgentData) {
        return navigator.userAgentData.mobile;
    } else {
        // Fallback to older method
        return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};        

function VidStackPlayer({ title, source, userIp, playerType = "default" }) {
    const [modifiedSource, setModifiedSource] = useState(source);
    const [playbackError, setPlaybackError] = useState(null);
    const [errorAccept, setErrorAccept] = useState(false);

    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const mediaPlayerRef = useRef(null);

    const isPortrait = useOrientation();

    const isMobile = isMobileDevice();

    const isOnline = useOnlineStatus({
        onlineCallback: () => setPlaybackError(null),
        offlineCallback: () =>
            setPlaybackError("You are not connected to the internet. Please connect and try again."),
    });

    useEffect(() => {
        if (source) {
            const newSource = generateSourceURL(source, userIp);
            setModifiedSource(newSource);
        }
    }, [source, userIp]);

    const handleError = useCallback(
        (error) => {
            const sessionStorageDontShowHlsErrorMessage = sessionStorage.getItem('dontShowHlsErrorMessage');

            if (error && error.code === 1 && isOnline && !errorAccept && (!sessionStorageDontShowHlsErrorMessage || sessionStorageDontShowHlsErrorMessage !== 'true')) {
                const videoServerDomain = new URL(process.env.VIDEO_SERVER_URL)?.hostname;
                const isVideoServerDomain = videoServerDomain ? modifiedSource.includes(videoServerDomain) : null;
                setPlaybackError(
                    isVideoServerDomain
                        ? "Playback stopped. Please hold for 30 seconds if video not started please connect to a any VPN."
                        : "Please wait while the video loads its take few seconds. Report us if it fails to load."
                );
            }
        },
        [modifiedSource, isOnline, errorAccept]
    );

    const handleObservers = useCallback(async (entries) => {

        const entry = entries[0];

        // player refs
        const playerContainer = containerRef.current;
        const player = playerRef.current;
        const mediaPlayer = mediaPlayerRef.current;

        // player floating and default effect classes
        const floatingClass = 'fixed top-0 left-2/4 sm:left-0 transform -translate-x-2/4 sm:translate-x-1/4 sm:w-[60%] w-[98%] max-w-sm h-auto z-50 rounded-md overflow-hidden opacity-40 transition-all duration-500';
        const staticClass = 'w-full h-full transition-all duration-500';
        const playerContainerFloatingClass = "w-full h-full flex justify-center items-center transition-all duration-500 shadow-xl shadow-slate-700 p-5 bg-gray-950";
        const playerContainerStaticClass = "w-full h-full flex justify-center items-center transition-all duration-500";

        if (!playerContainer || !player) return;

        // Handle non-portrait mode
        if (!isPortrait && isMobile) {
            if (player.classList.contains("fixed")) {
                player.classList.remove(...floatingClass.split(' '));
                player.classList.add(...staticClass.split(' '));
                playerContainer.classList.remove(...playerContainerFloatingClass.split(' '));
                playerContainer.classList.add(...playerContainerStaticClass.split(' '));
            };
            /**if (mediaPlayer) {
                // Handle video playback based on intersection
                if (!entry.isIntersecting) {
                    if (!mediaPlayer.paused) {
                        mediaPlayer.pause();
                    }
                } else {
                    if (mediaPlayer.paused) {
                        mediaPlayer.play();
                    }
                };
            }/** */
            return;
        };
        const playerWidth = player.clientWidth;
        const playerHeight = player.clientHeight;

        const makeReplacingPlayer = () => {
            // Create a div element for the replacement player
            const replacingPlayer = document.createElement('div');
            replacingPlayer.id = 'replacing-hls-player'; // Assign a unique ID
            replacingPlayer.className = `w-[${playerWidth}px] h-[${playerHeight}px] bg-gray-950 rounded-md overflow-hidden flex justify-center items-center opacity-40 transition-all duration-500`;
            // Set inner text
            replacingPlayer.innerHTML = '<p class="text-white text-sm text-center">Video in floating modee</p>';

            // Append the created element to the playerContainer
            if (playerContainer) {
                playerContainer.appendChild(replacingPlayer);
            }

            return replacingPlayer;
        };

        if (entry.isIntersecting) {

            player.classList.remove(...floatingClass.split(' '));
            player.classList.add(...staticClass.split(' '));
            player.removeAttribute('style');
            playerContainer.removeAttribute('style');
            // Remove the replacing player if it exists
            const replacingPlayer = document.getElementById('replacing-hls-player');
            if (replacingPlayer) {
                playerContainer.removeChild(replacingPlayer);
            }
            setTimeout(() => {
                player.classList.remove('opacity-40');
                playerContainer.classList.remove(...playerContainerFloatingClass.split(' '));
                playerContainer.classList.add(...playerContainerStaticClass.split(' '));
            }, 300);

        } else {

            player.classList.remove(...staticClass.split(' '));
            player.classList.add(...floatingClass.split(' '));
            player.removeAttribute('style');
            makeReplacingPlayer();
            setTimeout(() => {
                player.classList.remove('opacity-40');
                playerContainer.classList.remove(...playerContainerStaticClass.split(' '));
                playerContainer.classList.add(...playerContainerFloatingClass.split(' '));
            }, 300);
        }
    }, [isPortrait]);

    const dontShowErrorMessageAgain = () => {
        // Set the sessionStorage key to prevent showing the error message again
        sessionStorage.setItem('dontShowHlsErrorMessage', 'true');
        setErrorAccept(true);
    };

    useEffect(() => {

    }, [errorAccept])

    useEffect(() => {
        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        });
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [handleObservers]);

    return (
        <>
            <div
                ref={containerRef}
                className="w-full h-full flex justify-center items-center bg-transparent transition-all duration-500"
            >
                <div ref={playerRef} className="w-full h-full transition-all duration-500">
                    <MediaPlayer ref={mediaPlayerRef} onError={handleError} aspectRatio="16/9" title={title} src={modifiedSource} autoPlay playsInline className="w-full h-full">
                        <MediaProvider />
                        {playerType === "default" ? (
                            <DefaultVideoLayout colorScheme="dark" icons={defaultLayoutIcons} />
                        ) : (
                            <PlyrLayout icons={plyrLayoutIcons} />
                        )}
                    </MediaPlayer>
                </div>
            </div>

            {playbackError && !errorAccept && (
                <div className="fixed left-0 top-0 w-full h-full z-[100] bg-gray-900 bg-opacity-60 flex justify-center items-center">
                    <div className="w-full max-w-sm bg-white px-3 py-4 space-y-5 border border-gray-500 shadow-2xl rounded-sm mx-2">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill text-red-600 text-2xl"></i>
                            <div className="text-sm mobile:text-xs text-gray-800 font-bold">{playbackError || "Playback not work please try again later or watch another content"}</div>
                        </div>
                        <div className="flex justify-around flex-wrap gap-2">
                            <button
                                onClick={() => setErrorAccept(true)}
                                className="bg-cyan-700 text-white px-4 py-2 rounded-md mx-auto text-sm mobile:text-xs"
                            >
                                Understood
                            </button>
                            <button
                                onClick={dontShowErrorMessageAgain}
                                className="bg-gray-800 text-white px-4 py-2 rounded-md mx-auto text-sm mobile:text-xs"
                            >
                                Dont show again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default VidStackPlayer;
