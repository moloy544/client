
"use client"

import { useCallback, useEffect, useState } from 'react';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import useOnlineStatus from '@/lib/lib';

// Utility function to generate a new token, get user IP-like pattern, and set expiration
function generateSourceURL(originalURL, userIp) {
    if (!originalURL) {
        return '';
    };

    if (!originalURL.includes('ooat310wind.com')) {
        return originalURL;
    }
    // Calculate the expiration timestamp (6 hours from now)
    const expirationTimestamp = Math.floor(Date.now() / 1000) + (10 * 60 * 60);

    // Replace the expiration time and IP in the original URL
    const modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

    return modifiedURL;
}

function VidStackPlayer({ title, source, visibility, userIp, playerType = "default" }) {

    const [modifiedSource, setModifiedSource] = useState(null);
    const [playbackError, setPlaybackError] = useState(null);
    const [errorCount, setErrorCount] = useState(0);
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
        if (source && visibility) {
            const newSource = generateSourceURL(source, userIp);
            setModifiedSource(newSource);
        }
        if (errorCount !== 0) {
            setErrorCount(0);
        }
    }, [source, userIp, visibility]);

    const handleError = useCallback((error) => {
        if (error && error.code === 1 && isOnline) {
            const isWindHost = modifiedSource.includes('ooat310wind.com');
            if (isWindHost) {
                setErrorCount((prevCount) => {
                    const newCount = prevCount + 1;
                    if (newCount < 2) {
                        if (modifiedSource.startsWith('https://cdn4505.ooat310wind.com/stream2/i-arch-400/')) {
                            const replaceSource = modifiedSource.replace('https://cdn4505.ooat310wind.com/stream2/i-arch-400/', 'https://cdn4505.ooat310wind.com/stream2/i-cdn-0/');
                            const source = generateSourceURL(replaceSource, userIp);
                            setModifiedSource(source);
                        } else if (modifiedSource.startsWith('https://cdn4505.ooat310wind.com/stream2/i-cdn-0/')) {
                            const replaceSource = modifiedSource.replace('https://cdn4505.ooat310wind.com/stream2/i-cdn-0/', 'https://cdn4505.ooat310wind.com/stream2/i-arch-400/');
                            const source = generateSourceURL(replaceSource, userIp);
                            setModifiedSource(source);
                        }
                    } else {
                        setPlaybackError("The video could not be played. Please check your internet connection or connect to a VPN and try again.");
                    }
                    return newCount;
                });
            } else {
                setPlaybackError("Please wait a moment while the video is loading. If it doesn't play, please report it to us.");
            }
        }
    }, [modifiedSource, isOnline, userIp]);

    if (!visibility || !modifiedSource) {
        return null;
    };

    return (
        <>
            <div className="w-full h-full flex justify-center items-center bg-transparent">
                <MediaPlayer onError={handleError} aspectRatio="16/9" title={title} src={modifiedSource} autoPlay playsInline className="w-full h-full">
                    <MediaProvider />
                    {playerType === "default" ? (

                        <DefaultVideoLayout
                            colorScheme="dark"
                            icons={defaultLayoutIcons}
                        />
                    ) : (
                        <PlyrLayout
                            icons={plyrLayoutIcons}
                        />
                    )}
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
