"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useOrientation } from "@/hooks/hook";
import { useSelector } from "react-redux";
import { useDeviceType } from "@/hooks/deviceChecker";
import { generateCountrySpecificIp, isValidIp } from "@/helper/helper";

//Memoization to avoid unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.hlsSourceDomain === nextProps.hlsSourceDomain &&
    prevProps.source === nextProps.source &&
    prevProps.userIp === nextProps.userIp
  )
};

function removeSkipQueryParam(url) {
  const removalsQuery = ["skip", "backup_stream", "default_audio"];

  if (!url || typeof url !== "string" || !url.includes("?")) return url;

  try {
    const urlObj = new URL(url, "https://fallback.com");

    removalsQuery.forEach((key) => {
      if (urlObj.searchParams.has(key)) {
        urlObj.searchParams.delete(key);
      }
    });

    return urlObj.toString();
  } catch (e) {
    return url; // Fallback in case of invalid URL
  }
};

// Function to generate source URL with expiration and user IP
function generateSourceURL(originalURL, userIp) {

  if (!originalURL) return null;

  // If neither domain matches, return the original URL
  if (!originalURL.includes('stream2')) {
    return originalURL;
  }

  // Generate expiration timestamp
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 10 * 60 * 60;

  // Replace IP segment in the originalURL with expiration timestamp and user IP
  let modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

  modifiedURL = modifiedURL.includes('.m3u8') ? modifiedURL : `${modifiedURL}.m3u8`;

  return modifiedURL;
};

function createPlaybleSoure(source, ip) {
  if (!Array.isArray(source)) {
    return generateSourceURL(source, ip)
  };

  return source.map(lang => ({
    title: lang.language,
    folder: lang.seasons.map(season => ({
      title: `Season ${season.seasonNumber}`,
      folder: season.episodes.map((episodeUrl, index) => ({
        title: `EP ${index + 1}`,
        file: generateSourceURL(`${episodeUrl.includes('https://') ? episodeUrl : season.basePath + episodeUrl}`, ip)
      }))
    }))
  }));
};

const VideoPlayer = memo(({ title, source, userIp, videoTrim = null, default_audio, onVideoLoad }) => {

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isIframeLoading, setIsIframeLoading] = useState(null);
  const [playerPlaceholder, setPlayerPlaceHolder] = useState(false);

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
        const newSource = createPlaybleSoure(source, ip);
        const playerOptions = {
          id: 'player',
          file: removeSkipQueryParam(newSource),
        };

        // get default audio form source url e;se use default audio from props
        const defaultLang = new URL(newSource, 'https://fallback.com').searchParams.get('default_audio') || default_audio;

        if (defaultLang && typeof defaultLang === 'string') {
          playerOptions.default_audio = defaultLang;
        };

        let skipValue = 0;
        const getSkipValue = new URL(newSource, 'https://fallback.com').searchParams.get('skip');
        if (getSkipValue) {
          skipValue = parseInt(getSkipValue, 10);
        };

        if (skipValue > 0) {
          playerOptions.start = skipValue;
        } else if (videoTrim && typeof videoTrim === 'number') {
          playerOptions.start = videoTrim;
        }
        const playerInstance = {
          functionName: Array.isArray(newSource) ? 'MoviesbazarSeriesPlayer' : 'MoviesPlayer',
          id: Array.isArray(newSource) ? "series_player-script" : "movies_player-script",
          src: `/static/js/${Array.isArray(newSource) ? 'series_player_v1.js' : 'movies_player.js'}`
        };
       
        
        // Load player JS if it failed to load from parent component
        if (typeof window[playerInstance.functionName] !== "function") {
          
          setPlayerPlaceHolder("initializing player, please wait...");
      
          const script = document.createElement("script");
          script.id = playerInstance.id;
          script.src = playerInstance.src;
          script.async = true;
          script.onload = () => {
            if (typeof window[playerInstance.functionName] === "function") {

              window.player = new window[playerInstance.functionName](playerOptions);

              if (!isIOS) {
                onVideoLoad();
              };
              if (playerPlaceholder) {
                setPlayerPlaceHolder(false);
              };
            } else {
              setPlayerPlaceHolder("Failed to load video, please try again later.");
              console.error(`Function ${playerInstance.functionName} not found after script load.`);
            }

          };
          document.body.appendChild(script);
        } else {
          window.player = new window[playerInstance.functionName](playerOptions);
          if (!isIOS) {
            onVideoLoad();
          };
          if (playerPlaceholder && typeof window[playerInstance.functionName] !== "function") {
            setPlayerPlaceHolder("Failed to load video, please try again later.");
          }else if (playerPlaceholder) {
            setPlayerPlaceHolder(false);  
          }
        };

      } else {
        setIsIframeLoading("Please wait a moment...");

        const startTime = Date.now();

        const iframe = document.createElement("iframe");
        iframe.className = "w-full aspect-video my-auto";
        iframe.id = "player-embedded-iframe";
        iframe.allow = "autoplay; fullscreen";
        iframe.src = removeSkipQueryParam(source);
        iframe.title = title || "Movies Bazar Streaming Iframe";

        iframe.onload = () => {
          clearInterval(checkTimer);
          setIsIframeLoading(null);
        };

        playerRef.current.appendChild(iframe);

        checkTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          if (elapsed >= 64000) {
            setIsIframeLoading("Taking too much time. Please wait more or come back later.");
          } else if (elapsed >= 30000) {
            setIsIframeLoading("May be slow network or server delay.... please wait a bit more.");
          } else if (elapsed >= 18000) {
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
  }, [source, userRealIp, userIp, title, playerPlaceholder]);

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

  if (playerPlaceholder) {

    return (
      <div className="w-full aspect-video bg-black relative rounded-md overflow-hidden transition-all duration-500">
        {/* Loading Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          {/* Spinner */}
          <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-3"></div>

          {/* Loading Text */}
          <p className="text-white text-sm md:text-base font-medium tracking-wide animate-pulse text-center">
            {playerPlaceholder}
          </p>
        </div>
      </div>
    );
  };

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
