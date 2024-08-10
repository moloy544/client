
"use client"

import { useCallback, useEffect, useState } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import useOnlineStatus from '@/lib/lib';

// Utility function to generate a new token, get user IP-like pattern, and set expiration
function generateSourceURL(originalURL, userIp) {
    if (!originalURL) {
        return '';
    };

    if (!originalURL.includes('loner300artoa.com')) {
        return originalURL;
    }
    // Calculate the expiration timestamp (6 hours from now)
    const expirationTimestamp = Math.floor(Date.now() / 1000) + (10 * 60 * 60);

    // Replace the expiration time and IP in the original URL
    const modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

    return modifiedURL;
}

function VidStackPlayer({ title, source, visibility, userIp }) {

    const [modifiedSource, setModifiedSource] = useState(null);
    const [playbackError, setPlaybackError] = useState(null);
    // online offline handler
    const isOnline = useOnlineStatus({
        onlineCallback: () => {
            setPlaybackError(null);
        },
        offlineCallback: () => {
            setPlaybackError("You are not connected to internet please connect to internet connection and try again.");
        }
    });

    useEffect(() => {
        if (source) {
            const newSource = generateSourceURL(source, userIp);
            setModifiedSource(newSource);
        }
    }, [source, userIp]);

    const handleError = useCallback((error) => {

        if (error && error.code === 1 && isOnline) {

            const isLonerHost = modifiedSource.includes('loner300artoa.com');
            if (isLonerHost) {
                setPlaybackError("The video could not be played. Please check your internet connection or connect to any VPN and try again.");
            } else {
                setPlaybackError("Please wait a moment video is loading. in case is not playing video please report us.")
            }
        };
    }, [modifiedSource, isOnline]);

    if (!visibility || !modifiedSource) {
        return null;
    };

    return (
        <>
            <div className="w-full h-full flex justify-center items-center">
                <MediaPlayer onError={handleError} aspectRatio="16/9" title={title} src={modifiedSource} autoPlay playsInline className="w-full h-full">
                    <MediaProvider />
                    <DefaultVideoLayout
                        colorScheme="dark"
                        icons={defaultLayoutIcons}
                    />
                </MediaPlayer>
            </div>
            {playbackError && (
                <div className="fixed left-0 top-0 w-full h-full z-[100] bg-gray-900 bg-opacity-60 flex justify-center items-center">
                    <div className="w-full max-w-sm bg-white px-3 py-4 space-y-5 border border-gray-500 shadow-2xl rounded-sm mx-2">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill text-red-600 text-2xl"></i>
                            <div className="text-sm text-gray-800 font-bold">
                                {playbackError}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mx-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setPlaybackError(null);
                                }}
                                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-bold">
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default VidStackPlayer;
