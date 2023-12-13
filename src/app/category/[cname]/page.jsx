import { fetchMoviesFromServer } from "@/utils";
import { appConfig } from "@/config/config";
import MoviesSection from "@/app/components/MoviesSection";
import CategoryGroupSlider from "@/app/components/CategoryGroupSlider";
import NavigateBack from "@/app/components/NavigateBack";

const transformToCapitalizeQuery = (value) => {

  const editCapitalize = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ');

  return editCapitalize;
};

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalizeQuery(params.cname.replace(/[-]/g, ' '))

  return {
    title: `${editParamsQuery} movies`,
    description: `Download latest release ${editParamsQuery} movies online Movies Bazzer`,
    openGraph: {
      title: `${editParamsQuery} movies`,
      description: `Download latest release ${editParamsQuery} movies online Movies Bazzer`,
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

  const editParamsQuery = params.cname.toLowerCase();

  const editCapitalizeParamsQuery = transformToCapitalizeQuery(params.cname.replace(/[-]/g, ' '));

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
      <div className="sticky top-0 z-50 w-full h-auto bg-gray-900">
        
        <div className="w-auto h-auto flex items-center py-4 px-4 mobile:px-2">

        <NavigateBack className="bi bi-arrow-left text-white text-3xl mobile:text-[22px] cursor-pointer float-left" />

        <div className="px-5 mobile:px-2 text-yellow-400 text-xl mobile:text-base text-center justify-self-center truncate">
          {editCapitalizeParamsQuery} Movies
        </div>

        </div>

        <CategoryGroupSlider />

      </div>

      <MoviesSection query={query} initialMovies={filterResponse} isDataEnd={dataIsEnd} />
    </>
  )
};



