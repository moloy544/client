//import { headers } from "next/headers";
// IP nikalne ka function
/**async function getClientIp() {
    //const xRealIp = requestHeaders.get('x-real-ip');
    //const cfConnectingIp = requestHeaders.get('cf-connecting-ip');
    //const xForwardedFor = requestHeaders.get('x-forwarded-for');

    const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return data.ip;

    /**return (
      xRealIp ||
      cfConnectingIp ||
      (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
      'IP Not Found'
    );**/

import RestrictionsCheck from "@/components/RestrictionsCheck";


export default async function Page() {
  // headers() se current request headers milenge
  //const requestHeaders = headers();


  return (
    <RestrictionsCheck />
  );
}
