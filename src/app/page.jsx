import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatUrlLink } from "@/utils";
import Navbar from "@/components/Navbar";
import HomePageLayout from "./HomePageLayout";
import FixedSearchIcon from "@/components/FixedSearchIcon";
import SliderShowcase from "@/components/SliderShowcase";

export const revalidate = 3600 // revalidate at most every hour

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  const { sectionOne } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full py-2">

        {sectionOne?.sliderMovies?.map((data) => (

          <SliderShowcase key={data.title} title={data.title} moviesData={data.moviesData} linkUrl={data.linkUrl} />
        ))}

        <SliderShowcase title="Bollywood hindi actress" linkUrl="/actress/bollywood">
    
          {sectionOne?.bollywoodActressData?.map((actor) => (

            <Link
              href={`/actress/${creatUrlLink(actor.name)}/${actor.imdbId?.replace('nm', '')}`}
              key={actor.imdbId}
              title={actor.name}
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
        </SliderShowcase>

        <HomePageLayout />

      </main>

      <FixedSearchIcon />

    </>
  )
};
