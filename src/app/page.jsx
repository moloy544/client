import { appConfig } from "@/config/config";
import { fetchMoviesFromServer } from "../utils";
import MoviesGirdWarper from "./components/MoviesGirdWarper";
import Navbar from "./components/Navbar";

async function getMovies(query) {

  const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
    apiPath: `${appConfig.backendUrl}/api/v1/movies/get/${query}`,
    limitPerPage: 30,
    page: 1
  });

  const responseData = { filterResponse, dataIsEnd };

  return responseData;
};

export default async function Page() {

  const query = 2023;

  const { filterResponse, dataIsEnd } = await getMovies(query);

  return (
    <>
      <Navbar />
     
      <div className="w-full h-full bg-gray-800 py-2 m-0">
      <h2 className="text-white text-2xl mx-2 mt-3 mb-1 mobile:mt-1 mobile:text-base mobile:mb-0 font-bold">Latest release movies</h2>
      <MoviesGirdWarper query={query} initialMovies={filterResponse} isDataEnd={dataIsEnd} />
      </div>
    </>
  )
}


