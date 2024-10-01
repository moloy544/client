import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.category);

  const metaData = {
    title: {
      sbsolute:`${editParamsQuery} Series Collection | Stream Free Online at Movies Bazar`
    },
    description: `Watch a diverse collection of ${editParamsQuery} series online at Movies Bazar. Enjoy top-rated titles from various genres without any cost!`,
    keywords: `${editParamsQuery} series, stream ${editParamsQuery} series online, watch ${editParamsQuery} series free, where to watch ${editParamsQuery} series, online ${editParamsQuery} series`,
  
    openGraph: {
      images: 'https://res.cloudinary.com/moviesbazar/image/upload/v1722170830/logos/brand_log.jpg',
      title: {
        sbsolute:`${editParamsQuery} Series Collection | Stream Free Online at Movies Bazar`
      },
      description: `Watch a diverse collection of ${editParamsQuery} series online at Movies Bazar. Enjoy top-rated titles from various genres without any cost!`,
      url: `${appConfig.appDomain}/series/${params.category}`,
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