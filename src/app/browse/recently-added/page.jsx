import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/app/components/errors/SomthingWrongError'), { ssr: false })

export const revalidate = 3600 // revalidate at most every hour

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/recently-added`;

  const filterData = {
    genreSort: "all"
  };

  const extraFilter = [{
    title: "Filter by industry",
    data: [
        {
            id: 1,
            filter: 'industry',
            name: "hollywood"
        },

        {
            id: 2,
            filter: 'industry',
            name: "bollywood"
        },
        {
            id: 3,
            filter: 'industry',
            name: "south"
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

  return (
    <>
      <NavigateBackTopNav title="Recently Added" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          initialFilter={filterData}
          serverResponseExtraFilter={extraFilter}
          limitPerPage={40}
          filterCounter={data.filterCount}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};