import { fetchLoadMoreMovies, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

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
      url: `https://moviesbazaar.vercel.app/browse/latest/${params.slug}`
    },
  };

  return metaData;
};

export default async function Page({ params }) {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/latest/${params.slug}`;
 
  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30
  });

  const title = transformToCapitalize(params.slug);

  return (
    <>
      <NavigateBackTopNav title={`${title} latest`} />

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