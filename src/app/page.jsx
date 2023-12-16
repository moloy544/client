import { appConfig } from "@/config/config";
import { fetchMoviesFromServer } from "../utils";
import MoviesGirdWarper from "./components/MoviesGirdWarper";
import Navbar from "./components/Navbar";

export default async function Page() {

  const query = 2023;

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/clisting/${query}`

  const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
    apiPath: apiUrl,
    limitPerPage: 30,
    page: 1
  });

  return (
    <>
      <Navbar />

      <div className="w-full h-full bg-gray-800 py-2 m-0">

        <h2 className="text-white text-2xl mx-2 mt-3 mb-1 mobile:mt-1 mobile:text-sm mobile:mb-0 font-bold">Latest release movies</h2>

        <MoviesGirdWarper
          apiUrl={apiUrl}
          query={query}
          initialMovies={filterResponse}
          isDataEnd={dataIsEnd} />

      </div>
    </>
  )
}


