import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const metadata = {

  title: {
    absolute: 'Top IMDb Rated Movies | Watch the Best Films Online at Movies Bazar'
  },
  description: 'Stream the highest-rated IMDb movies online at Movies Bazar. Discover top-rated films from Hollywood, Bollywood, and South Cinema.',
  keywords: 'IMDb top rated movies, watch top rated films online, best Hollywood movies, best Bollywood movies, best South Indian movies',

  openGraph: {
    images: 'https://res.cloudinary.com/moviesbazar/image/upload/v1722170830/logos/brand_log.jpg',
    title: {
      absolute: 'Top IMDb Rated Movies | Watch the Best Films Online at Movies Bazar'
    },
    description: 'Watch top IMDB rated movies movies online Movies Bazaar',
    url: appConfig.appDomain + '/browse/top-rated'
  },
};

export const revalidate = 14400 * 2 // revalidate at most every 8 hours

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/top-rated`;

  const filterData = {
    dateSort: -1,
    ratingSort: -1,
    genre: "all"
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
      <NavigateBackTopNav title="Top Rated" />

      <div className="w-full h-full min-h-[90vh]">

        <LoadMoreMoviesGirdWarper
          title="Top IMDB Rated Movies Collection"
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