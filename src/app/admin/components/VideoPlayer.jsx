import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import _ from "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";

// those imports are important

export const HlsVideoPlayer = ({source, thambnail}) => {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);
    
  useEffect(() => {
    if (player) {
      player.src({
        src: source,
        type: "application/x-mpegURL",
        withCredentials: false
      });
      player.poster(thambnail);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, thambnail]);


  useEffect(() => {
    const videoJsOptions = {
      autoplay: true,
      preload: "auto",
      controls: false,
      poster: "",
      sources: [
        {
          src: source,
          type: "application/x-mpegURL",
          withCredentials: false
        }
      ],
      html5: {
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        nativeTextTracks: true
      }
    };

    const p = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        // console.log('onPlayerReady');
      }
    );

    setPlayer(p);
    console.log(p.qualityLevels());

    return () => {
      if (player) player.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true });
    }
  }, [player]);
  return (
   
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="vidPlayer video-js vjs-default-skin vjs-big-play-centered"
      ></video>
    </div>

  );
};

