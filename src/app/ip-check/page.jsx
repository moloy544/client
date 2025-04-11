import TopSlideNotice from "@/components/notice/TopSlideNotice";
import { headers } from "next/headers";

function getClientData() {
  const requestHeaders = headers();

  const cfConnectingIp = requestHeaders.get('cf-connecting-ip');
  const xForwardedFor = requestHeaders.get('x-forwarded-for');
  const xRealIp = requestHeaders.get('x-real-ip');
  const countryCode = requestHeaders.get('cf-ipcountry');

  const ip = cfConnectingIp || xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) || "0.0.0.0";

  const data = {
    cfConnectingIp,
    xForwardedFor,
    xRealIp,
    ip,
    countryCode
  };

  return data;
}

export default function Page() {
  const clientData = getClientData();

  return (
    <div>
      <h2>xForwardedFor: {clientData.xForwardedFor || "N/A"}</h2>
      <h2>cfConnectingIp: {clientData.cfConnectingIp || "N/A"}</h2>
      <h2>xRealIp: {clientData.xRealIp || "N/A"}</h2>
      <h2>Selected IP: {clientData.ip}</h2>
      <h4>Country code: {clientData.countryCode || "N/A"}</h4>
      <TopSlideNotice />
    </div>
  );
}
