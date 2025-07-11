"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useOrientation } from "@/hooks/hook";
import { useSelector } from "react-redux";
import { useDeviceType } from "@/hooks/deviceChecker";
import { generateCountrySpecificIp, generateSourceURL, isValidIp } from "@/helper/helper";

//Memoization to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.hlsSourceDomain === nextProps.hlsSourceDomain &&
    prevProps.source === nextProps.source &&
    prevProps.userIp === nextProps.userIp
  )
};

function createPlaybleSoure(hlsProviderDomain, seriesData, ip) {
  if (!Array.isArray(seriesData)) {
    return generateSourceURL(hlsProviderDomain, seriesData, ip)

  }
  return seriesData.map(lang => ({
    title: lang.language,
    folder: lang.seasons.map(season => ({
      title: `Season ${season.seasonNumber}`,
      folder: season.episodes.map((episodeUrl, index) => ({
        title: `Episode ${index + 1}`,
        file: generateSourceURL(hlsProviderDomain, `${episodeUrl.includes('https://') ? episodeUrl : season.basePath + episodeUrl}`, ip)
      }))
    }))
  }));
};

const VideoPlayer = memo(({ title, hlsSourceDomain, source, userIp, videoTrim = null, watermark = false, onVideoLoad }) => {

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isIframeLoading, setIsIframeLoading] = useState(null);

  const isPortrait = useOrientation();
  const { userRealIp } = useSelector((state) => state.fullWebAccessState);

  const { isMobile, isIOS } = useDeviceType();

  useEffect(() => {
    let checkTimer = null;
    let ip = userRealIp || userIp;

    if (!ip || ip === '0.0.0.0' || !isValidIp(ip)) {
      ip = generateCountrySpecificIp();
    };
    
    if (source && ip) {

      if (source.includes('.m3u8') || source.includes('.mkv') || Array.isArray(source)) {
        const newSource = createPlaybleSoure(hlsSourceDomain, source, ip);

        const playerOptions = {
          id: 'player',
          file: newSource,

        };

        if (videoTrim && typeof videoTrim === 'number') {
          playerOptions.start = videoTrim;
        };

        const playerInstance = {
          functionName: Array.isArray(newSource) ? 'MoviesbazarSeriesPlayer' : 'MoviesbazarPlayer',
          id: Array.isArray(newSource) ? "series-playerjs-script" : "playerjs-script",
          src: `/static/js/${Array.isArray(newSource) ? 'series_player_v1.js' : 'player_v2.1.js'}`
        };

        function addWatermarkOverlay() {
          if (!watermark) {
            return
          }
          setTimeout(() => {
            const videoElement = document.querySelector("#player video");
            const positions = [
              { top: "0px", left: "0px" },
              { top: "0px", right: "0px" },
              { bottom: "0px", left: "0px" },
              { bottom: "0px", right: "0px" }
            ];
            if (videoElement) {
              const parent = videoElement.parentElement;
              if (parent && parent.style.position !== "relative") parent.style.position = "relative";
              positions.forEach((pos, i) => {
                const overlay = document.createElement("div");
                overlay.id = `wm-block-${i}`;
                overlay.setAttribute("style", `position: absolute; width: 100%; height: 11%; background-color: rgba(0, 0, 0, 0.8); border-radius: 2px; z-index: 9999; pointer-events: none;`);
                Object.assign(overlay.style, pos);
                parent?.appendChild(overlay);
              });
            }
          }, 600);
        };

        // Load player JS if it failed to load from parent component
        if (typeof window[playerInstance.functionName] !== "function") {
          const script = document.createElement("script");
          script.id = playerInstance.id;
          script.src = playerInstance.src;
          script.async = true;
          script.onload = () => {
            if (typeof window[playerInstance.functionName] === "function") {
              window.player = new window[playerInstance.functionName](playerOptions);
              addWatermarkOverlay();
              if (!isIOS) {
                onVideoLoad();
              };
            } else {
              console.error(`Function ${playerInstance.functionName} not found after script load.`);
            }
          };
          document.body.appendChild(script);
        } else {
          window.player = new window[playerInstance.functionName](playerOptions);
          addWatermarkOverlay();
          if (!isIOS) {
            onVideoLoad();
          };
        };

      } else {
        setIsIframeLoading("Please wait a moment...");

        const startTime = Date.now();

        const iframe = document.createElement("iframe");
        iframe.className = "w-full aspect-video my-auto";
        iframe.id = "player-embedded-iframe";
        iframe.allow = "autoplay; fullscreen";
        iframe.src = source;
        iframe.title = title || "Movies Bazar Streaming Iframe";

        iframe.onload = () => {
          clearInterval(checkTimer);
          setIsIframeLoading(null);
        };

        playerRef.current.appendChild(iframe);

        checkTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          if (elapsed >= 50000) {
            setIsIframeLoading("Can't load video. Please check your connection or report the issue.");
            clearInterval(checkTimer);
          } else if (elapsed >= 25000) {
            setIsIframeLoading("Slow network... please wait a bit more.");
          } else if (elapsed >= 15000) {
            setIsIframeLoading("Loading is taking longer than expected. Please wait...");
          }

        }, 1000);
      };

      return () => {
        clearInterval(checkTimer);

        const playerJsScript = document.querySelector("#playerjs-script");

        if (playerRef.current) {
          const iframe = playerRef.current.querySelector("#player-embedded-iframe");
          if (iframe) playerRef.current.removeChild(iframe);
        }

        if (playerJsScript) document.body.removeChild(playerJsScript);
      };
    }
  }, [source, userRealIp, userIp, title]);

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

    if (!playerContainer || !player || isIOS) return;

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
        <div id="player" ref={playerRef} className="w-full h-fit relative transition-all duration-500 rounded-md">
          {isIframeLoading && (
            <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center px-2">
              <p className="text-white text-sm font-medium tracking-wide animate-pulse text-center">{isIframeLoading}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}, areEqual);

export default VideoPlayer;
VideoPlayer.displayName = 'VideoPlayer';
