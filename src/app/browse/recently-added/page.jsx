import dynamicLoading from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamicLoading(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const metadata = {
  title:{
    absolute: 'Recently Added Movies | Explore the Latest Picks at Movies Bazar'
  } 
};

//export const revalidate = 7200 // revalidate at most every 2 hours
/// force to dinamic 
export const dynamic = "force-dynamic";

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/recently-added`;

  const filterData = {
    genre: "all",
    createdAt: -1
  };

  const { status, data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 40
  });

  if (status === 500) {
    return (
      <SomthingWrongError />
    )
  };

  const { filterOptions, moviesData } = data;

  return (
    <>
      <NavigateBackTopNav title="Recently Added" />

      <div className="w-full h-full min-h-[90vh]">

        <LoadMoreMoviesGirdWarper
          title="Recently Added Or Updated Content"
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