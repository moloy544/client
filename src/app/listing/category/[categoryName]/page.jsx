import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import { categoryArray, moviesGenre } from "@/constant/constsnt";

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

  const category = params?.categoryName.toLowerCase().replace(/[-]/g, ' ');

  function filterQueryParam() {

    switch (category) {

      case 'new release':
        return 2023;
      case 'sci fi':
        return 'Sci-Fi';
      default:
        return category;
    };
  };

  const query = filterQueryParam();

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/category/${query}`;

  const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({

    apiPath: apiUrl,
    limitPerPage: 30,
    page: 1
  });;

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

      <FilterDropDown />

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

function FilterDropDown(){

  return(
    <div className="space-y-2 fixed top-[70px] right-4 z-50">
          <details
            className="overflow-hidden rounded-sm border border-gray-300 [&_summary::-webkit-details-marker]:hidden shadow-xl"
          >
            <summary
              className="flex cursor-pointer items-center justify-between gap-2 bg-white p-2 text-gray-900 transition"
            >
              <span className="text-sm font-medium">Filter</span>

              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-200 bg-white">

              <ul className="space-y-1 border-t border-gray-200 p-4 max-h-[400px] overflow-y-auto">

              <li>
                    <div>
                      <input
                        type="radio"
                        name="genre"
                        value="All"
                        id="all-genre"
                        className="peer hidden"
                      />

                      <label
                        htmlFor="all-genre"
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white p-2 text-gray-900 hover:border-gray-200 peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white  hover:bg-gray-100"
                      >
                        <p className="text-sm font-medium">All</p>
                      </label>
                    </div>
                  </li>

                {moviesGenre.map((genre) => (

                  <li key={genre.id}>
                    <div className="py-2">
                      <input
                        type="radio"
                        name="genre"
                        value={genre.name}
                        id={genre.name}
                        className="peer hidden"
                      />

                      <label
                        htmlFor={genre.name}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white p-1 text-gray-900 hover:border-gray-200 peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white  hover:bg-gray-100"
                      >
                        <p className="text-sm font-medium">{genre.name}</p>
                      </label>
                    </div>
                  </li>
                ))}

              </ul>
            </div>
          </details>


        </div>

  )

}



