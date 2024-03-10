import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.categoryName);

  const metaData = {
    title: `${editParamsQuery} movies collaction`,
    description: `Watch ${editParamsQuery} movies, series free  of cost online Movies Bazaar have lot of ${editParamsQuery} movies and series collaction`,
    keywords: `${editParamsQuery} movie, Watch ${editParamsQuery} movie online, ${editParamsQuery} movie watch free online, Where to watch ${editParamsQuery} movies online`,

    openGraph: {
      images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
      title: `${editParamsQuery} movies collaction`,
      description: `Watch ${editParamsQuery} movies, series free of cost online Movies Bazaar have lot of ${editParamsQuery} movies and series collaction`,
      url: `https://moviesbazar.online/listing/category/${params.categoryName}`
    },
  };

  return metaData;
};

export default async function Page({ params }) {

  const category = params?.categoryName;

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/category/${category}`;

  const filterData = {
    dateSort: -1,
    genreSort: "all",
  };

  const { data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 30
  });

  const categoryName = transformToCapitalize(params.categoryName);

  return (
    <>
      <NavigateBackTopNav title={categoryName} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          limitPerPage={30}
          initialFilter={filterData}
          filterCounter={data.filterCount}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};