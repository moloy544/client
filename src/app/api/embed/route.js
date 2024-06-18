import { NextResponse } from "next/server";

export async function GET(req) {
    try {
       
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
        return new NextResponse(`<html>
            <body style="background: black">
            <div style="color: white;font-family: monospace;text-align: center;top: calc(50%);height: 7%;vertical-align: middle;position: relative;">
          Internal serve error occurred
            </div>
            </body>
            </html>`, {
            headers: {
                'Content-Type': 'text/html',
            },
            status: 403
        });
    }
};
