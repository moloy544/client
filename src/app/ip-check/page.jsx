import { headers } from "next/headers";


function getClientIp() {

    const requestHeaders = headers();
    const xRealIp = requestHeaders.get('x-real-ip');
    const xForwardedFor = requestHeaders.get('x-forwarded-for');

    return (
        xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
        "0.0.0.0");

};

export default function Page() {

    return <h2>ip is: {getClientIp()}</h2>
}
