import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.category);

  const metaData = {
    title: `${editParamsQuery} series collaction`,
    description: `Watch ${editParamsQuery} series online Movies Bazaar`,
    keywords: `${editParamsQuery} series, Watch ${editParamsQuery} series online, ${editParamsQuery} series watch free online, Where to watch ${editParamsQuery} series online`,

    openGraph: {
      images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
      title: `${editParamsQuery} series`,
      description: `Watch ${editParamsQuery} series online Movies Bazaar`,
      url: `${appConfig.appDomain}/series/${params.category}`
    },
  };

  return metaData;
};

export default async function Page({ params }) {

  const category = params.category;

  const apiUrl = `${appConfig.backendUrl}/api/v1/series/${category}`;

  const filterData = {
    dateSort: -1,
    genre: "all",
  };

  const { data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 30
  });

  const title = transformToCapitalize(category + ' series');

  const { filterOptions, moviesData } = data;

  return (
    <>
      <NavigateBackTopNav title={title} />

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          limitPerPage={40}
          serverResponseExtraFilter={filterOptions || []}
          initialFilter={filterData}
          initialMovies={moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>
      <Footer />
    </>
  )
};