import { NextResponse } from "next/server";

const creatErrorMessage = (message) => {
    return `<html>
        <body style="background: black">
        <div style="color: white;font-family: monospace;text-align: center;top: calc(50%);height: 7%;vertical-align: middle;position: relative;">
      ${message}
        </div>
        </body>
        </html>`;
}

export async function GET(req) {
    try {

        const requestUrl = new URL(req.url);
        const { searchParams } = requestUrl;
        // get imdb id and api key from url search params
        const imdbId = searchParams.get('id');
        const key = searchParams.get('key')?.toString();

        // video hls server url
        const hls_url = process.env.VIDEO_SERVER_URL;

        // if key is undefined or key is not valid show error message 
        /**if (!key || key !== '65be6dec73f8bb0a5811457b') {

            return new NextResponse(creatErrorMessage('Unregistered user or invalid user'), {
                headers: {
                    'Content-Type': 'text/html',
                },
                status: 403
            });
        } skip this for some reson*/

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
        return new NextResponse(creatErrorMessage('Internal serve error occurred'), {
            headers: {
                'Content-Type': 'text/html',
            },
            status: 403
        });
    }
};
