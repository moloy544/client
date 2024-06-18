import { NextResponse } from "next/server";

const creatErrorMessage = (message) => {
    return `<html>
            <body style="background: black">
            <div style="color: white;font-family: monospace;text-align: center;top: calc(50%);height: 7%;vertical-align: middle;position: relative;">
            ${message}
            </div>
            </body>
            </html>`
};

export async function GET(req) {
    try {
        const allowedDomains = ['watchyouflix.com']; // List of allowed domains

        // Extract the referer domain
        const referer = req.headers.get('referer');
console.log(req.headers);
console.log(req)

        if (!referer) {
            return new NextResponse(creatErrorMessage("Something Went Wrong!"), {
                headers: {
                    'Content-Type': 'text/html',
                },
                status: 403
            });
        }

        const refererUrl = new URL(referer);
        const refererDomain = refererUrl.hostname;

        // Check if the referer domain is allowed
        if (!allowedDomains.includes(refererDomain)) {
            return new NextResponse(creatErrorMessage("Forbidden: Domain not allowed"), {
                headers: {
                    'Content-Type': 'text/html',
                },
                status: 403
            });
        }

        const requestUrl = new URL(req.url);
        const { searchParams } = requestUrl;
        // get imdb id from url search params
        const imdbId = searchParams.get('id');
        // video hls server url
        const hls_url = process.env.VIDEO_SERVER_URL;

        return new NextResponse(`
            <iframe 
                src="${hls_url + imdbId}" 
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 300;" 
                allowfullscreen="allowfullscreen">
            </iframe>
        `, {
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (error) {
        console.log(error);

        // if any error occurs then return error message
        return new NextResponse(creatErrorMessage("Internal server error"), {
            headers: {
                'Content-Type': 'text/html',
            },
            status: 403
        });
    }
};
