import TopSlideNotice from "@/components/notice/TopSlideNotice";
import { headers } from "next/headers";


function getClientData() {

    const requestHeaders = headers();
    const xRealIp = requestHeaders.get('x-real-ip');
    const xForwardedFor = requestHeaders.get('x-forwarded-for');
    const countryCode =  requestHeaders.get['cf-ipcountry'];

    const ip =  xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
        "0.0.0.0";

        const data ={ip, countryCode};

    return data

};

export default function Page() {

    const clientData = getClientData();

    return(
        <div>
         <h2>ip is: {clientData.ip}</h2>
         <h4>Country code: {clientData.countryCode || "N/A"}</h4>
         <TopSlideNotice />
         </div>
    )
}
