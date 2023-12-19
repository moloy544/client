import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import MoviesGirdWarper from "@/app/components/MoviesGirdWarper";
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
    description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
    openGraph: {
      title: `${editParamsQuery} movies`,
      description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
      url: `https://moviesbazaar.vercel.app/category/${params.cname}`
    },
  }
};


export default async function Page({ params }) {

  const editParamsQuery = params.cname.toLowerCase().replace(/[-]/g, ' ');

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

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/clisting/${query}`;

  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30,
    page: 1
  });;

  const categoryName = transformToCapitalizeQuery(params.cname);

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
      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2">
        <MoviesGirdWarper
          apiUrl={apiUrl}
          query={query}
          initialMovies={filterResponse}
          isDataEnd={dataIsEnd} />
      </div>
    </>
  )
};



