import { isIOS } from "@/helper/helper";

export const appConfig = {
    appDomain: process.env.APP_DOMAIN,
    backendUrl: isIOS() ? "https://moviesbazarapi.vercel.app" :process.env.BACKEND_SERVER_URL,
}