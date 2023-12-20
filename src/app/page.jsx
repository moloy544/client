import { appConfig } from "@/config/config";
import Navbar from "./components/Navbar";
import Link from "next/link";
import axios from "axios";
import MoviesCard from "./components/MoviesCard";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/home_layout`

  const response = await axios.get(apiUrl);

  const { latestMovies, bollywoodMovies, southMovies } = response.data;

  const firstSectionData = [{
    title: 'Hollywood latest movies',
    linkUrl: '/category/hollywood',
    moviesData: latestMovies
  }, {
    title: 'Bollywood latest movies',
    linkUrl: '/category/bollywood ',
    moviesData: bollywoodMovies
  }, {
    title: 'South latest movies',
    linkUrl: '/category/south',
    moviesData: southMovies
  },]

  return (
    <>
      <Navbar />

      <main className="w-full h-full bg-gray-800 m-0">

        {firstSectionData.map((data) => (

          <section key={data.title} className="w-full h-auto py-2 mobile:py-1">

            <div className="w-full h-auto flex justify-between items-center px-2 pb-2">
              <h2 className="text-gray-300 text-2xl mobile:text-sm font-semibold">{data.title}</h2>
              <Link href={data.linkUrl} className="text-lg mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
            </div>

            <div className="w-full h-auto flex flex-row overflow-x-scroll whitespace-nowrap gap-2 px-2">

              <MoviesCard moviesData={data.moviesData} />

            </div>

          </section>
        ))}

      </main>
    </>
  )
}
