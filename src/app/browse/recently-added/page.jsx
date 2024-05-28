import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const revalidate = 3600 // revalidate at most every hour

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/recently-added`;

  const filterData = {
    genre: "all"
  };

  const filterOptions = [
{

  title: "Filter by type",
  data: [
      {
          id: 1,
          filter: 'type',
          name: "movie"
      },
      {
          id: 2,
          filter: 'type',
          name: "series"
      }]
}];

  const { status, data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 40
  });

  if (status === 500) {
    return(
      <SomthingWrongError />
    )
  };

  if (data.genreFilter) {
    filterOptions.unshift({ title: "Filter by genre", data: data.genreFilter });
  };

  if (data.industryFilter) {
    filterOptions.unshift({ title: "Filter by industry", data: data.industryFilter });
    
};

  return (
    <>
      <NavigateBackTopNav title="Recently Added" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          initialFilter={filterData}
          serverResponseExtraFilter={filterOptions}
          limitPerPage={40}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};