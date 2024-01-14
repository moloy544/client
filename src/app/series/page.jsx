import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

//Revalidate page every 30 minutes
export const revalidate = 1800;

export const metadata = {

    title: 'Series',
    description: 'Explore a diverse collection of web series from Hollywood, Bollywood, and South Indian cinema. Enjoy top-rated series in each category with compelling stories and brilliant performances.',
    keywords: 'web series, Hollywood series, Bollywood series, South Indian series',
  }

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/series`;

  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30
  });

  return (
    <>
      <NavigateBackTopNav title="Series" />

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2">

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