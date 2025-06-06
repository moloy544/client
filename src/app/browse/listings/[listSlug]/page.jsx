import dynamicLoading from "next/dynamic";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import { notFound } from "next/navigation";

const SomthingWrongError = dynamicLoading(() => import('@/components/errors/SomthingWrongError'), { ssr: false });

const validateSlug = (slug) => {
  const validSlugs = ['trending-content'];
  return validSlugs.includes(slug);
}

const handleApiPath = (slug) => {
  let apiPath = null;
  if (slug && validateSlug(slug)) {

    switch (slug) {
      case 'trending-content':
        apiPath = 'listing/trending';

        break;
      default: null
        break;
    }

  }
  const fullApiUrl = `${appConfig.backendUrl}/api/v1/${apiPath}`;
  return fullApiUrl;
};

export async function generateMetadata({ params }) {

  const { listSlug } = params;

  const editParamsQuery = transformToCapitalize(listSlug);

  if (!validateSlug(listSlug)) {
    return;
  };

  const metaData = {
    title: {
      absolute: `Explore The ${editParamsQuery} Collection | Stream Free Online at Movies Bazar`
    },
    description: `Explore a vast collection of ${editParamsQuery} available for free streaming on Movies Bazar. Watch your favorite ${editParamsQuery} online free!`,

  };


  return metaData;
};


export default async function Page({ params }) {

  const { listSlug } = params;

  const isValidSlug = validateSlug(listSlug);

  if (!isValidSlug) {
    return notFound();
  };
  
  const apiUrl = handleApiPath(listSlug);

  const filterData = {
    genre: "all",
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

  const editParamsQuery = transformToCapitalize(listSlug);

  return (
    <>
      <NavigateBackTopNav title={editParamsQuery} />

      <div className="w-full h-full min-h-[90vh]">

        <LoadMoreMoviesGirdWarper
          title={`Explore Listings: ${editParamsQuery}`}
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