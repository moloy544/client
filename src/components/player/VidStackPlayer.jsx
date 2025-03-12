"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useOrientation } from "@/hooks/hook";
import { isMobileDevice } from "@/utils";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

//Memoization to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.title === nextProps.title &&
        prevProps.source === nextProps.source
    )
};

const VidStackPlayer = memo(({ title, source }) => {

    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const isPortrait = useOrientation();

    const isMobile = isMobileDevice();

    const handleObservers = useCallback(async (entries) => {

        const entry = entries[0];

        // player refs
        const playerContainer = containerRef.current;
        const player = playerRef.current;

        // player floating and default effect classes
        const floatingClass = 'fixed top-0 left-1/2 transform -translate-x-1/2 sm:left-0 sm:translate-x-5 sm:w-[60%] w-[98%] max-w-sm h-auto z-50 rounded-md overflow-hidden opacity-40 transition-all duration-500';
        const staticClass = 'relative w-full max-w-[800px] h-[450px] mx-auto transition-all duration-500'; // Adjust max width and height; // Adjust max width and height

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
            replacingPlayer.innerHTML = '<p class="text-white text-sm text-center">Video in floating mode</p>';

            // Append the created element to the playerContainer
            if (playerContainer) {
                playerContainer.appendChild(replacingPlayer);
            }

            return replacingPlayer;
        };

        if (entry.isIntersecting) {
            player.classList.remove(...floatingClass.split(' '));
            player.classList.add(...staticClass.split(' ')); // Ensure static class is applied
            player.removeAttribute('style');
            playerContainer.removeAttribute('style');
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
            makeReplacingPlayer();
            player.classList.remove(...staticClass.split(' '));
            player.classList.add(...floatingClass.split(' '));
            player.removeAttribute('style');

            setTimeout(() => {
                player.classList.remove('opacity-40');
                playerContainer.classList.remove(...playerContainerStaticClass.split(' '));
                playerContainer.classList.add(...playerContainerFloatingClass.split(' '));
            }, 300);
        }

    }, [isPortrait, isMobile]);

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
                className="bg-transparent transition-all duration-500"
            >
                <div ref={playerRef} className="w-full h-fit transition-all duration-500 flex items-center rounded-2xl">
                   
                        <MediaPlayer title={title || "Movies Bazar"} src={source} aspectRatio="16/9" autoPlay playsInline className="w-full h-full">
                            <MediaProvider />
                            <DefaultVideoLayout icons={defaultLayoutIcons} />
                        </MediaPlayer>
                </div>
            </div>

        </>
    );
}, areEqual);

export default VidStackPlayer;
VidStackPlayer.displayName = 'VidStackPlayer';
