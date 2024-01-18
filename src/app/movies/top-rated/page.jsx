import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";


//Revalidate page every 30 minutes
export const revalidate = 1800;

export const metadata = {

    title: 'Top Rated Movies',
    description: 'Watch Imdb top rated movies online Movies Bazaar',
    keywords: 'imbd top ratings movies, watch top ratings movies online, Top rated Hollywood movies, Top Rated South movies, Top rated Bollywood movies',
  }

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/top-rated`;

  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30
  });

  return (
    <>
      <NavigateBackTopNav title="Top Rated" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        {filterResponse.length > 0 ? (
          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            initialMovies={filterResponse}
            isDataEnd={dataIsEnd} 
            />
        ) : (
          <h2 className="my-40 text-yellow-500 text-xl mobile:text-base text-center font-semibold">No Movies Found</h2>

        )}

      </div>

    </>
  )
};