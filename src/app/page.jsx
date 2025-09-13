import axios from "axios";
import { appConfig } from "@/config/config";
import dynamicLoad from "next/dynamic";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";
import Footer from "@/components/Footer";
const LoadContentError = dynamicLoad(() => import('@/components/errors/LoadContentError'), { ssr: false });

// get home page data from backend server
const getHomePageData = async () => {
  const fetchFromApi = async (url) => {
    try {
      const res = await axios.post(url, { offset: 1 });
      return res;
    } catch (err) {
      if (err.response) {
        return { status: err.response.status };
      }
      return { status: 500 };
    }
  };

  // 1st attempt
  let response = await fetchFromApi(`${appConfig.backendUrl}/api/v1/landing_page`);

  // Retry with backup only if first failed with 500
  if (response.status === 500) {
    response = await fetchFromApi(`${appConfig.backendUrl2}/api/v1/landing_page`);
  }

  // Success
  if (response && response.status === 200) {
    return response;
  }

  // If both fail
  throw new Error("Failed to fetch home page data");
};


export const metadata = {
  alternates: {
    canonical: `${appConfig.appDomain}`
  },
};


// revalidate at most every 1 hours to avoid unnecessary API calls and improve performance
//export const revalidate = 3600;
/// force to dinamic 
export const dynamic = "force-dynamic";

// Fetch home page data and render HomePageLayout component
export default async function Page() {

  const homePageResponse = await getHomePageData();
  const { status, data } = homePageResponse;

  return (
    <>
      <Navbar />

      {status === 200 ? (
        <main className="w-full overflow-x-hidden h-full py-2 bg-custom-dark-bg">
          <HomePageLayout initialLayoutData={data} />
        </main>
      ) : (
        <div className="w-full h-full min-h-[450px] bg-custom-dark-bg flex items-center justify-center">
        <LoadContentError />
        </div>
      )}
      <Footer />
    </>
  )
};
