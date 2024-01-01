import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import { moviesGenreArray } from "@/constant/constsnt";
import MoviesFilterDropDown from "../../MoviesFilterDropDown";

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

  const editParamsQuery = transformToCapitalizeQuery(params.categoryName);

  const metaData = {
    title: `${editParamsQuery} movies`,
    description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
    keywords: `${editParamsQuery} movie, Watch ${editParamsQuery} movie online, ${editParamsQuery} movie watch free online, Where to watch ${editParamsQuery} movies online`,

    openGraph: {
      title: `${editParamsQuery} movies`,
      description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
      url: `https://moviesbazaar.vercel.app/listing/category/${params.categoryName}`
    },
  };

  return metaData;
};


export default async function Page({ params }) {

  const category = params?.categoryName;

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/category/${category}`;

  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30,
    page: 1
  });
  
  const categoryName = transformToCapitalizeQuery(params.categoryName);

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-auto flex justify-between items-center bg-red-800 px-2 border-b border-b-yellow-700">

        <div className="w-auto h-auto flex items-center py-4 mobile:py-2">
          <NavigateBack className="bi bi-arrow-left text-white text-3xl mobile:text-[25px] cursor-pointer" />
          <div className="px-5 mobile:px-2 text-yellow-400 text-xl mobile:text-base text-center justify-self-center truncate">
            {categoryName}
          </div>
        </div>
        <Link href="/search" className="text-white mr-20 mobile:mr-3 p-1 text-2xl mobile:text-xl">
          <i className="bi bi-search"></i>
        </Link>

      </div>

      <MoviesFilterDropDown filterData={moviesGenreArray.genre} />

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          initialPage={1}
          initialMovies={filterResponse}
          isDataEnd={dataIsEnd} />

      </div>

    </>
  )
};