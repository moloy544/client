import { appConfig } from "@/config/config";
import Navbar from "./components/Navbar";
import Link from "next/link";
import axios from "axios";
import LazyLoadingImage from "./components/LazyLoadingImage";
import HomePageLayout from "./HomePageLayout";
import SliderMoviesShowcase from "./components/SliderMoviesShowcase";
import FixedSearchIcon from "./components/FixedSearchIcon";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page`;

  const response = await axios.post(apiUrl, { offset: 1 });

  const { firstSectionData } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-x-hidden h-full bg-gray-800 py-2">

        {firstSectionData?.sliderMovies?.map((data) => (

          <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.moviesData} linkUrl={data.linkUrl} />
        ))}

        <section className="w-full h-fit pt-2">

          <div className="w-full h-auto flex justify-center items-center mx-2.5 my-2">
            <div className="w-fit h-auto border-b-2 border-b-yellow-500 px-10 mobile:px-5 pb-0.5">
              <h1 className="text-xl mobile:text-sm text-gray-200 text-center font-semibold">
                Bollywood Top Actress
              </h1>
            </div>
          </div>

          <div className="w-full h-fit flex flex-row overflow-x-scroll overflow-y-hidden whitespace-nowrap gap-2 md:gap-5 px-2 py-3 scrollbar-hidden">

            {firstSectionData?.topActressData?.map((actor) => (

              <Link
                href={`/listing/actress/${actor.name.toLowerCase().replace(/[' ']/g, '-')}`}
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
