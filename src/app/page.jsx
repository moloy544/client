import axios from "axios";
import { appConfig } from "@/config/config";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";
import Footer from "@/components/Footer";

const getHomePageData = async () => {
  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/landing_page`, { offset: 1 });
    return response;
  } catch (error) {
    return new Error("Failed to fetch home page data");
  }
}

export const revalidate = 7200 // revalidate at most every 2 hours

export default async function Page() {

  const homePageResponse = await getHomePageData();
  const { status, data } = homePageResponse;

  return (
    <>
      <Navbar />
      {status === 200 ? (
        <main className="w-full overflow-x-hidden h-full py-2 bg-gray-800">
          <HomePageLayout initialLayoutData={data} />
        </main>
      ) : (
        <div className="w-full min-h-[70vh] bg-gray-800 flex justify-center items-center">
          <div className="">
          <div className="text-center text-lg font-bold text-gray-100">Error while load movies</div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
};
