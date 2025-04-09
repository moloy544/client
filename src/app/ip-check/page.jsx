import { headers } from "next/headers";

import RestrictionsCheck from "@/components/RestrictionsCheck";

function getClientIp() {

    const requestHeaders = headers();
    const xRealIp = requestHeaders.get('x-real-ip');
    const xForwardedFor = requestHeaders.get('x-forwarded-for');

    return (
        xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
        'IP Not Found');

};

export default function Page() {

    const clientIp = getClientIp();

    return (
        <RestrictionsCheck userServerGetIp={clientIp} />
    );
}
