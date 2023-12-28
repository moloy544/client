import { appConfig } from "@/config/config";
import Navbar from "./components/Navbar";
import Link from "next/link";
import axios from "axios";
import MoviesCard from "./components/MoviesCard";
import LazyLoadingImage from "./components/LazyLoadingImage";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page?offset=1`;

  const response = await axios.get(apiUrl);

  const { latestMovies, bollywoodMovies, southMovies, topActressData } = response.data;

  const firstSectionData = [
    {
      title: 'Hollywood latest movies',
      linkUrl: 'listing/category/hollywood',
      moviesData: latestMovies
    },
    {
      title: 'Bollywood latest movies',
      linkUrl: 'listing/category/bollywood ',
      moviesData: bollywoodMovies
    },
    {
      title: 'South latest movies',
      linkUrl: 'listing/category/south',
      moviesData: southMovies
    }
  ]

  return (
    <>
      <Navbar />

      <main className="w-full h-full bg-gray-800 m-0 py-2">

        {firstSectionData.map((data) => (

          <section key={data.title} className="w-full h-auto pt-2 mobile:pt-1">
 
            <div className="w-full h-auto flex justify-between items-center px-2 pb-2">
              <h2 className="text-gray-200 text-2xl mobile:text-sm font-semibold">{data.title}</h2>
              <Link href={data.linkUrl} className="text-lg mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
            </div>

            <div className="w-full h-auto flex flex-row overflow-x-scroll whitespace-nowrap gap-2 px-2">

              <MoviesCard moviesData={data.moviesData} />

            </div>

          </section>
        ))}

        <section className="w-full h-fit bg-gray-800 pt-2">

          <div className="w-full h-auto flex justify-center items-center mx-2 my-2">
            <div className="w-fit h-auto border-b-2 border-b-yellow-500 px-10 mobile:px-5 pb-0.5">
            <h1 className="text-xl mobile:text-sm text-gray-200 text-center font-semibold">
              Top Actress
            </h1>
            </div>
          </div>

          <div className="w-full h-fit flex flex-row overflow-x-scroll overflow-y-hidden whitespace-nowrap gap-2 md:gap-5 px-2 py-3">

            {topActressData?.map((actor) => (

              <Link
                href={`/listing/actress/${actor.name.toLowerCase().replace(/[' ']/g, '-')}`}
                key={actor._id}
                className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-pink-100 rounded-md" prefetch={false}>

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

      </main>
    </>
  )
}
