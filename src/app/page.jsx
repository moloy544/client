import { appConfig } from "@/config/config";
import Navbar from "./components/Navbar";
import Link from "next/link";
import axios from "axios";
import MoviesCard from "./components/MoviesCard";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/home_layout`

  const response = await axios.get(apiUrl);

  const { latestMovies, bollywoodMovies, southMovies } = response.data;

  return (
    <>
      <Navbar />

      <main className="w-full h-full bg-gray-800 py-2 m-0">

        <section className="w-full h-auto py-3 mobile:py-1">

          <div className="w-full h-auto flex justify-between items-center px-2 pb-2">
            <h2 className="text-white text-2xl mobile:text-sm font-bold">Hollywood latest movies</h2>
            <Link href="/category/hollywood" className="text-lg mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
          </div>

          <div className="w-full h-auto flex flex-row overflow-x-scroll whitespace-nowrap gap-2 px-2">

          <MoviesCard moviesData={latestMovies} />

          </div>

        </section>

        <section className="w-full h-auto py-3 mobile:py-1">

          <div className="w-full h-auto flex justify-between items-center px-2 pb-2">
            <h2 className="text-white text-2xl mobile:text-sm font-bold">Bollywood latest movies</h2>
            <Link href="/category/bollywood" className="text-lg mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
          </div>

          <div className="w-full h-auto flex flex-row overflow-x-scroll whitespace-nowrap gap-2 px-2">

          <MoviesCard moviesData={bollywoodMovies} />

          </div>

        </section>

        <section className="w-full h-auto py-3 mobile:py-1">

          <div className="w-full h-auto flex justify-between items-center px-2 pb-2">
            <h2 className="text-white text-2xl mobile:text-sm font-bold">South latest movies</h2>
            <Link href="/category/south" className="text-lg mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
          </div>

          <div className="w-full h-auto flex flex-row overflow-x-scroll whitespace-nowrap gap-2 px-2">

          <MoviesCard moviesData={southMovies} />

          </div>

        </section>

      </main>
    </>
  )
}
