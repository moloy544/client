"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useOrientation } from "@/hooks/hook";
import { isMobileDevice } from "@/utils";

//Memoization to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.hlsSourceDomain === nextProps.hlsSourceDomain &&
    prevProps.source === nextProps.source &&
    prevProps.userIp === nextProps.userIp
  )
};


function generateRandomIp() {
  const part1 = Math.floor(Math.random() * 256);
  const part2 = Math.floor(Math.random() * 256);
  const part3 = Math.floor(Math.random() * 256);
  const part4 = Math.floor(Math.random() * 256);
  return `${part1}.${part2}.${part3}.${part4}`;
};

function isValidIp(ip) {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;
  return ipRegex.test(ip);
};

export function generateSourceURL(hlsSourceDomain, originalURL, userIp) {

  if (!originalURL) return null;

  const hlsProviderDomain = new URL(hlsSourceDomain || process.env.VIDEO_SERVER_URL).hostname + 'm';
  const secondHlsProviderDomain = new URL(process.env.SECOND_VIDEO_SERVER_URL).hostname + 'd';

  // Check if the originalURL contains either hlsProviderDomain or secondHlsProviderDomain
  const isHlsProviderMatch = originalURL.includes(hlsProviderDomain);
  const isSecondHlsProviderMatch = originalURL.includes(secondHlsProviderDomain);

  // If neither domain matches, return the original URL
  if (!isHlsProviderMatch && !isSecondHlsProviderMatch && !originalURL.includes('stream2')) {
    return originalURL;
  }

  // Generate expiration timestamp
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 10 * 60 * 60;

  // Replace IP segment in the originalURL with expiration timestamp and user IP
  const modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

  return modifiedURL;
}


const VideoPlayer = memo(({ title, hlsSourceDomain, source, userIp }) => {

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const isPortrait = useOrientation();

  const isMobile = isMobileDevice();

  useEffect(() => {

    let ip = userIp;

    if (!ip || ip === '0.0.0.0' || !isValidIp(ip)) {
      ip = generateRandomIp();

    };

    if (source && ip) {

      if (source.includes('.m3u8') || source.includes('.mkv')) {
        const newSource = generateSourceURL(hlsSourceDomain, source, ip);
        const script = document.createElement("script");
        script.id = "playerjs-script";
        script.src = "/static/js/player_v2.1.js";
        script.async = true;
        script.onload = () => {

          new MoviesbazarPlayer({
            id: 'player',
            file: newSource
          });

        };
        document.body.appendChild(script);
      } else {
        //load embed iframe if is not hls url
        const iframe = document.createElement("iframe");
        iframe.className = "w-full aspect-video my-auto";
        iframe.id = "player-embedded-iframe";
        iframe.allow = "autoplay; fullscreen";
        iframe.src = source;
        playerRef.current.appendChild(iframe);
      }

      // Cleanup function
      return () => {

        const playerJsScript = document.querySelector("#playerjs-script");

        if (playerRef.current) {
          const iframe = playerRef.current.querySelector("#player-embedded-iframe");
          if (iframe) playerRef.current.removeChild(iframe);
        }

        if (playerJsScript) document.body.removeChild(playerJsScript);
      };
    }
  }, [source, userIp, title]);

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
        <div id="player" ref={playerRef} className="w-full h-fit transition-all duration-500 rounded-md">

        </div>
      </div>

    </>
  );
}, areEqual);

export default VideoPlayer;
VideoPlayer.displayName = 'VideoPlayer';
