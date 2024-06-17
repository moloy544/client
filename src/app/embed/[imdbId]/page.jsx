'use client'
import { useEffect, useState } from "react";
import axios from "axios";

import { appConfig } from "@/config/config";

export default function EmbedVideos({ params }) {
    
    const imdbId = params.imdbId;

    const [watchLink, setWtachLink] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                if (error) {
                    setError(null)
                };
                const response = await axios.get(`${appConfig.backendUrl}/api/v1/subscriber/embed/${imdbId}`);
                const { message, source } = response.data || {};
                if (response.status === 200) {

                    setWtachLink(source);
                    const body = document.querySelector('body');
                    body.setAttribute('class', 'scrollbar-hidden');
                } else {
                    setError(message)
                }

            } catch (error) {
                if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message || "Internal Server error please try again later");
                };
                console.log(error)
            } finally {
                setLoading(false);
            }
        })()

    }, [imdbId]);

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full border-none z-[300] bg-black flex justify-center items-center px-3">
                <div className="w-full h-auto py-6 flex justify-center items-center flex-col">
                    <div className="text-cyan-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div>
                    <div className="text-base text-gray-100 text-center my-2">Loading...</div>
                </div>
            </div>
        )
    }

    if (!loading && error) {
        return (
            <div className="fixed top-0 left-0 w-full h-full border-none z-[300] bg-black flex justify-center items-center px-3">
                <h2 className="text-center text-2xl mobile:text-base text-blue-50 font-semibold">{error}</h2>
            </div>
        )
    };

    return (
        <iframe
            className="fixed top-0 left-0 w-full h-full border-none z-[300]"
            src={watchLink}
            allowFullScreen="allowfullscreen" />
    )
};
