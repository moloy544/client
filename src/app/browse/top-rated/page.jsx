import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

export const metadata = {

  title: 'Top IMDB rated movies',
  description: 'Watch top IMDB rated movies movies online Movies Bazaar',
  keywords: 'imbd top ratings movies, watch top ratings movies online, Top rated Hollywood movies, Top Rated South movies, Top rated Bollywood movies',

  openGraph: {
    images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
    title: 'Top IMDB rated movies',
    description: 'Watch top IMDB rated movies movies online Movies Bazaar',
    url: 'https://moviesbazaar.vercel.app/browse/top-rated'
  },
}

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/top-rated`;

  const { filterResponse, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    limitPerPage: 30
  });

  return (
    <>
      <NavigateBackTopNav title="Top imdb rated" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        {filterResponse.length > 0 ? (
          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            limitPerPage={30}
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