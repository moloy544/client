import dynamic from "next/dynamic";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/app/components/errors/SomthingWrongError'), { ssr: false })

export const metadata = {

  title: 'Top IMDB rated movies',
  description: 'Watch top IMDB rated movies movies online Movies Bazaar',
  keywords: 'imbd top ratings movies, watch top ratings movies online, Top rated Hollywood movies, Top Rated South movies, Top rated Bollywood movies',

  openGraph: {
    images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
    title: 'Top IMDB rated movies',
    description: 'Watch top IMDB rated movies movies online Movies Bazaar',
    url: 'https://moviesbazar.online/browse/top-rated'
  },
}

export default async function Page() {

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/top-rated`;

  const filterData = {
    dateSort: -1,
    ratingSort: -1,
    genre: "all"
  };

  const extraFilter = [{
    title: "Filter by industry",
    data: [
        {
            id: 1,
            filter: 'industry',
            name: "hollywood"
        },

        {
            id: 2,
            filter: 'industry',
            name: "bollywood"
        },
        {
            id: 3,
            filter: 'industry',
            name: "south"
        }]
}];

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

  return (
    <>
      <NavigateBackTopNav title="Top imdb rated" />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          initialFilter={filterData}
          serverResponseExtraFilter={extraFilter}
          limitPerPage={40}
          filterCounter={data.filterCount}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};