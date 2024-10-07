import axios from "axios";
import { appConfig } from "@/config/config";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";
import Footer from "@/components/Footer";

export const revalidate = 7200 // revalidate at most every 2 hours

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full py-2 bg-gray-800">

        <HomePageLayout initialLayoutData={response.data} />

      </main>
      
      <Footer />
    </>
  )
};
