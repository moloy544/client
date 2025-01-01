import axios from "axios";
import dinamc from "next/dynamic"
import { appConfig } from "@/config/config";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";
import Footer from "@/components/Footer";

// Dynamically import festival components
const NewYearCelebration = dinamc(()=> import("@/components/festivals/NewYearCelebration", {
  ssr: false,
}));

const getHomePageData = async () => {
  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/landing_page`, { offset: 1 });
    return response;
  } catch (error) {
    return new Error("Failed to fetch home page data");
  }
};

// revalidate at most every 1 hours to avoid unnecessary API calls and improve performance
export const revalidate = 3600;

// Fetch home page data and render HomePageLayout component
export default async function Page() {

  const homePageResponse = await getHomePageData();
  const { status, data } = homePageResponse;

  return (
    <>
      <Navbar />
   
      <NewYearCelebration />

      {status === 200 ? (
        <main className="w-full overflow-x-hidden h-full py-2 bg-custom-dark-bg">
          <HomePageLayout initialLayoutData={data} />
        </main>
      ) : (
        <div className="w-full min-h-[70vh] bg-custom-dark-bg flex justify-center items-center">
          <div className="">
            <div className="text-center text-lg font-bold text-gray-100">Error while load movies</div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
};
