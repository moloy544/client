import axios from "axios";
import { appConfig } from "@/config/config";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";

export const revalidate = 3600 // revalidate at most every hour

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  const { sectionOne } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full py-2">

        <HomePageLayout initialLayoutData={sectionOne} />

      </main>

    </>
  )
};
