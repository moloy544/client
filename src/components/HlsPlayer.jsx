
import { useEffect, useState } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

// Utility function to generate a new token, get user IP-like pattern, and set expiration
function generateSourceURL(originalURL, userIp) {
    if (!originalURL) {
        return '';
    };
    // Calculate the expiration timestamp (6 hours from now)
    const expirationTimestamp = Math.floor(Date.now() / 1000) + (10 * 60 * 60);

    // Replace the expiration time and IP in the original URL
    const modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

    return modifiedURL;
}

function VidStackPlayer({ title, source, visibility, userIp }) {
    const [modifiedSource, setModifiedSource] = useState(null);

    useEffect(() => {
        if (source) {
            const newSource = generateSourceURL(source, userIp);
            setModifiedSource(newSource);
        }
    }, [source]);

    if (!visibility || !modifiedSource) {
        return null;
    }

    return (
        <MediaPlayer aspectRatio="16/9" title={title} src={modifiedSource} autoPlay playsInline>
            <MediaProvider />
            <DefaultVideoLayout
                colorScheme="dark"
                icons={defaultLayoutIcons}
            />
        </MediaPlayer>
    );
}

export default VidStackPlayer;
