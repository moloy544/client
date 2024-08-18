import VidStackPlayer from "@/components/HlsPlayer";
import { headers } from "next/headers";

function getIP() {

    const FALLBACK_IP_ADDRESS = '76.76.21.123'
    const forwardedFor = headers().get('x-forwarded-for');
    if (process.env.NODE_ENV === "development") {
        return FALLBACK_IP_ADDRESS;
    }

    if (forwardedFor) {
        return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
    }

    return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

function EmbedPage({ searchParams }) {
    const { url } = searchParams || {};

    const userIp = getIP();

    if (!searchParams || !url || !url?.includes('.m3u8')) {
        return (
            <div className=" w-full h-screen bg-gray-950 flex justify-center items-center">
                <div className="text-base text-gray-50 font-semibold">Invalid embed link or code.</div>
            </div>
        )
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[#111827] overflow-hidden fixed">
        <VidStackPlayer
            visibility={true}
            source={url}
            userIp={userIp}
            playerType="plyr"
        />
        </div>
    )
}

export default EmbedPage;
