import { appConfig } from "@/config/config";
import axios from "axios";
import { NextResponse } from "next/server";

// Extract IP addresses from the request
function getIP(req) {
    const FALLBACK_IP_ADDRESS = '76.76.21.123';
    const forwardedFor = req.headers.get('x-forwarded-for');

    if (process.env.NODE_ENV === "development") {
        return FALLBACK_IP_ADDRESS;
    }

    return forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || FALLBACK_IP_ADDRESS;
}

// Generate new source URL
function generateSourceURL(originalURL, userIp) {

    const parsedUrl = new URL(originalURL);

    if (!originalURL.includes(parsedUrl.hostname)) return originalURL;
    if (!originalURL.includes('.m3u8')) return originalURL

    const EXPIRATION_TIME = Math.floor(Date.now() / 1000) + 10 * 60 * 60; // 10 hours
    return originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${EXPIRATION_TIME}:${userIp}:`);
}

// Create error message response
const createErrorMessage = (message) => {
    return `<html>
        <body style="background: black">
            <div style="color: white; font-family: monospace; text-align: center; top: calc(50%); height: 7%; vertical-align: middle; position: relative;">
                ${message}
            </div>
        </body>
    </html>`;
};

// Create response for movies player
const moviesBazarPlayer = (source) => {
    if (!source.includes('.m3u8')) {
        return `<iframe 
                src="${source}" 
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 300;" 
                allowfullscreen="allowfullscreen">
            </iframe>`;
    }

    return `<html>
    <head>
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
                background-color: black;
                height: 100vh;
                overflow: hidden;
            }
            .container {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            #banner {
                margin-inline: auto;
            }
        </style>
    </head>
    <body>

        <div class="container">
        <div id="player" style="width: 100%; height: 100%;"></div>
        </div>

        <script type="text/javascript">
            const script = document.createElement("script");
            script.id = "playerjs-script";
            script.src = "/static/js/player.js";
            script.async = true;
            script.onload = () => {
                const player = new MoviesbazarPlayer({
                    id: 'player',
                    file: '${source}',
                    width: '100%',
                    height: '100%',
                    stretching: 'fill'
                });
            };
            document.body.appendChild(script);
        </script>
        <script type="text/javascript" src="//filthygracefulspinach.com/de/76/3a/de763a67f50e8441e9ba957065f79f20.js" async="true"></script>
    </body>
</html>
`;
};

export async function GET(req) {
    try {
        const requestUrl = new URL(req.url);
        const imdbId = requestUrl.searchParams.get('id');

        // Validate IMDB ID
        if (!imdbId || imdbId.length <= 6) {
            return new NextResponse(createErrorMessage('Invalid IMDB ID or its too short'), { status: 400 });
        }

        // Get the user's IP address
        const ip = "76.76.21.123";//getIP(req);

        // Fetch video source from backend
        const getSourceResponse = await axios.post(`${appConfig.backendUrl}/api/v1/subscriber/embed`, { contentId: imdbId });

        // Handle non-successful response
        if (getSourceResponse.status !== 200) {
            const errorMessage = getSourceResponse.status === 404 ? 'Content not found !' : 'An internal server error occurred. Please try again later.';
            return new NextResponse(createErrorMessage(errorMessage), { status: 404 });
        }

        const watchLink = getSourceResponse.data.source;
        const status = getSourceResponse.data.status;
        if (status && status === "coming soon") {
            return new NextResponse(createErrorMessage('Content is coming soon. Please check back later.'), { status: 404 });
        };

        // Handle missing sources
        if (!watchLink || !Array.isArray(watchLink) || watchLink.length === 0) {
            return new NextResponse(createErrorMessage('Source not found. Please contact support.'), { status: 404 });
        }

        // Extract .m3u8 source or fallback to the first entry
        const m3u8Sources = watchLink.filter(link => link.endsWith('.m3u8'));
        const source = m3u8Sources.length > 0 ? m3u8Sources[0] : watchLink[0];

        // Generate the modified URL with user IP expiration timestamp
        const modifiedSource = generateSourceURL(source, ip);

        return new NextResponse(moviesBazarPlayer(modifiedSource), { headers: { 'Content-Type': 'text/html' } });

    } catch (error) {
        console.error('Error:', error.message || error);

        // Return generic error message for any unexpected error
        return new NextResponse(createErrorMessage('An internal server error occurred. Please try again later.'), { status: 500 });
    }
};
