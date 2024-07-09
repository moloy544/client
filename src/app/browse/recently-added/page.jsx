import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const revalidate = 3600 // revalidate at most every hour

export const metadata = {
  title: 'Recently Added',
}

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/recently-added`;

  const filterData = {
    genre: "all",
    dateSort: 'recent added'
  };

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

  const { filterOptions, moviesData } = data;

  return (
    <>
      <NavigateBackTopNav title="Recently Added" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          initialFilter={filterData}
          serverResponseExtraFilter={filterOptions || []}
          limitPerPage={40}
          initialMovies={moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};