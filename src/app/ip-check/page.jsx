import { headers } from "next/headers";

export default function Page() {
  // headers() se current request headers milenge
  const requestHeaders = headers();

  // IP nikalne ka function
  function getClientIp() {
    const xRealIp = requestHeaders.get('x-real-ip');
    const cfConnectingIp = requestHeaders.get('cf-connecting-ip');
    const xForwardedFor = requestHeaders.get('x-forwarded-for');

    return (
      xRealIp ||
      cfConnectingIp ||
      (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) ||
      'IP Not Found'
    );
  }

  const clientIp = getClientIp();

  return <h1>Client IP: {clientIp}</h1>;
}
