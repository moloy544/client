import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.slug);

  const metaData = {
    title: `Latest release ${editParamsQuery} movies`,
    description: `Watch resently release ${editParamsQuery} movies online Movies Bazaar`,
    keywords: `latest release ${editParamsQuery} movie, Watch latest release ${editParamsQuery} movie online, latest release ${editParamsQuery} movie watch free online, Where to watch latest release ${editParamsQuery} movies online`,

    openGraph: {
      images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
      title: `Latest release ${editParamsQuery} movies`,
      description: `Watch resently release ${editParamsQuery} movies online Movies Bazaar`,
      url: `${appConfig.appDomain}/browse/latest/${params.slug}`
    },
  };

  return metaData;
};

export default async function Page({ params }) {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/latest/${params.slug}`;

  const filterData = {
    dateSort: -1,
    genre: "all",
  };
 
  const { data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 40
  });

  const title = transformToCapitalize(params.slug);

  const filterOptions = [{

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

  if (data.genreFilter) {
    filterOptions.unshift({ title: "Filter by genre", data: data.genreFilter })
  };


  return (
    <>

      <NavigateBackTopNav title={`${title} latest`} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            initialFilter={filterData}
            limitPerPage={40}
            serverResponseExtraFilter={filterOptions}
            initialMovies={data.moviesData || []}
            isDataEnd={dataIsEnd}
          />

      </div>

    </>
  )
};