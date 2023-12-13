import { fetchMoviesFromServer } from "@/utils";
import { appConfig } from "@/config/config";
import MoviesGirdWarper from "@/app/components/MoviesGirdWarper";
import CategoryGroupSlider from "@/app/components/CategoryGroupSlider";
import NavigateBack from "@/app/components/NavigateBack";
import Link from "next/link";

const transformToCapitalizeQuery = (text) => {
  // Split the text into an array of words
  const words = text.split('-');

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words with a space and return the result
  return capitalizedWords.join(' ');
};

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalizeQuery(params.cname)

  return {
    title: `${editParamsQuery} movies`,
    description: `Watch ${editParamsQuery} movies online Movies Bazzer`,
    openGraph: {
      title: `${editParamsQuery} movies`,
      description: `Watch ${editParamsQuery} movies online Movies Bazzer`,
    },
  }
};

async function getPosts(query) {

  const { filterResponse, dataIsEnd } = await fetchMoviesFromServer({
    apiPath: `${appConfig.backendUrl}/api/v1/movies/get/${query}`,
    limitPerPage: 20,
    page: 1
  });

  const responseData = { filterResponse, dataIsEnd };

  return responseData;

};

export default async function Page({ params }) {

  const editParamsQuery = params.cname.toLowerCase().replace(/[-]/g, ' ');

  const editCapitalizeParamsQuery = transformToCapitalizeQuery(params.cname);

  function filterQueryParam() {

    switch (editParamsQuery) {

      case 'new release':
        return 2023;
      case 'sci fi':
        return 'Sci-Fi';
      default:
        return editParamsQuery;
    };
  };

  const query = filterQueryParam();

  // Fetch data directly in a Server Component
  const { filterResponse, dataIsEnd } = await getPosts(query);

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-auto flex justify-between items-center bg-gray-900 px-2 border-b border-b-red-700">

        <div className="w-auto h-auto flex items-center py-4 mobile:py-2">
          <NavigateBack className="bi bi-arrow-left text-white text-3xl mobile:text-[22px] cursor-pointer" />
          <div className="px-5 mobile:px-2 text-yellow-400 text-xl mobile:text-base text-center justify-self-center truncate">
            {editCapitalizeParamsQuery}
          </div>
        </div>
        <Link href="/search" className="mr-20 mobile:mr-3 p-1 text-2xl mobile:text-xl text-white">
          <i className="bi bi-search"></i>
        </Link>
      </div>

      <MoviesGirdWarper query={query} initialMovies={filterResponse} isDataEnd={dataIsEnd} />
    </>
  )
};



