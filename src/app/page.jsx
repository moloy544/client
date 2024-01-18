import { appConfig } from "@/config/config";
import Navbar from "./components/Navbar";
import Link from "next/link";
import axios from "axios";
import LazyLoadingImage from "./components/LazyLoadingImage";
import HomePageLayout from "./HomePageLayout";
import SliderMoviesShowcase from "./components/SliderMoviesShowcase";
import FixedSearchIcon from "./components/FixedSearchIcon";
import { creatUrlLink } from "@/utils";

//Revalidate page every 30 minutes
export const revalidate = 1800;

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  const { firstSectionData } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full py-2">

        {firstSectionData?.sliderMovies?.map((data) => (

          <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.moviesData} linkUrl={data.linkUrl} />
        ))}

        <section className="w-full h-auto pt-2.5 mobile:pt-1">

          <div className="w-full h-auto flex justify-between items-center px-2.5 pb-2">
            <h2 className="text-gray-100 text-[18px] mobile:text-sm font-semibold">Bollywood top actress</h2>
            <Link href="/actress/bollywood" className="text-base mobile:text-[12px] text-cyan-400">See more</Link>
          </div>

          <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2.5 mobile:gap-2 px-2 scrollbar-hidden">

            {firstSectionData?.bollywoodActressData?.map((actor) => (

              <Link
                href={`/actress/${actor.industry?.toLowerCase()}/${creatUrlLink(actor.name)}`}
                key={actor._id}
                className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-pink-100 rounded-md">

                <div className="w-24 h-24 mobile:w-20 mobile:h-20 rounded-full border-2 border-yellow-500">
                  <LazyLoadingImage
                    className="w-full h-full object-fill pointer-events-none select-none rounded-full"
                    actualSrc={actor.avatar}
                    alt={actor.name}
                  />
                </div>

                <div className="w-24 h-auto mobile:w-20 text-gray-900 overflow-hidden py-1.5">
                  <p className="whitespace-normal text-xs font-semibold font-sans text-center leading-[14px]">
                    {actor.name}
                  </p>
                </div>

              </Link>
            ))}

          </div>

        </section>

        <HomePageLayout />

      </main>

      <FixedSearchIcon />

    </>
  )
}
