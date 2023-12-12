import { appConfig } from "@/config/config";
import { fetchMoviesFromServer } from "../utils";
import MoviesSection from "./components/MoviesSection";

async function getPosts(query) {

  const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
    apiPath: `${appConfig.backendUrl}/api/v1/movies/get/${query}`,
    limitPerPage: 20,
    page: 1
  });

  const responseData = { filterResponse, dataIsEnd };

  return responseData;
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const { filterResponse, dataIsEnd } = await getPosts('all')
  
  return <MoviesSection query="all" initialMovies={filterResponse} isDataEnd={dataIsEnd} />
}


