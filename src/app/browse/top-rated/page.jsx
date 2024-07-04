import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import { filterOptionsOnject } from "@/constant/filterOptions";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const metadata = {

  title: 'Top IMDB rated movies',
  description: 'Watch top IMDB rated movies movies online Movies Bazaar',
  keywords: 'imbd top ratings movies, watch top ratings movies online, Top rated Hollywood movies, Top Rated South movies, Top rated Bollywood movies',

  openGraph: {
    images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
    title: 'Top IMDB rated movies',
    description: 'Watch top IMDB rated movies movies online Movies Bazaar',
    url: appConfig.appDomain+'/browse/top-rated'
  },
}

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/top-rated`;

  const filterData = {
    dateSort: -1,
    ratingSort: -1,
    genre: "all"
  };

  const { typeOptions, providerOptions } = filterOptionsOnject;

  const filterOptions = [typeOptions, providerOptions];

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
    filterOptions.unshift({ title: "Filter by genre", data: data.genreFilter })
  };

  if (data.industryFilter) {
    filterOptions.unshift({ title: "Filter by industry", data: data.industryFilter });
    
};

  return (
    <>
      <NavigateBackTopNav title="Top imdb rated" />

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