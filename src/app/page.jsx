import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatUrlLink } from "@/utils";
import Navbar from "./components/Navbar";
import HomePageLayout from "./HomePageLayout";
import SliderMoviesShowcase from "./components/SliderMoviesShowcase";
import FixedSearchIcon from "./components/FixedSearchIcon";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  const { sectionOne } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full py-2">

        {sectionOne?.sliderMovies?.map((data) => (

          <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.moviesData} linkUrl={data.linkUrl} />
        ))}

        <section className="w-full h-auto pt-2.5 mobile:pt-1">

          <div className="w-full h-auto flex justify-between items-center px-2.5 pb-3 mobile:pb-2">
            <h1 className="text-gray-100 text-[18px] mobile:text-sm font-medium">
              Bollywood top actress
            </h1>

            <Link href="/actress/bollywood" className="text-[14px] mobile:text-[12px] text-cyan-400 hover:text-cyan-500 font-medium">
              View All
              <i className="bi bi-chevron-right"></i>
            </Link>
            
          </div>

          <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2.5 mobile:gap-2 px-2 scrollbar-hidden">

            {sectionOne?.bollywoodActressData?.map((actor) => (

              <Link
                href={`/actress/${actor.industry?.toLowerCase()}/${creatUrlLink(actor.name)}`}
                key={actor._id}
                className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-pink-100 rounded-md">

                <div className="w-24 h-24 mobile:w-20 mobile:h-20 rounded-full border-2 border-cyan-500">

                  <Image
                    className="w-full h-full object-fill pointer-events-none select-none rounded-full"
                    src={actor.avatar}
                    width={100}
                    height={100}
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
