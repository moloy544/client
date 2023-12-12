import { fetchMoviesFromServer } from "@/utils";
import { appConfig } from "@/config/config";
import MoviesSection from "@/app/components/MoviesSection";

export async function generateMetadata({ params }) {

    const editParamsQuery = params.cname.split('-') // Split the string by hyphens
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' ');

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

    // Fetch data directly in a Server Component
    const { filterResponse, dataIsEnd } = await getPosts(query);

    return <MoviesSection query={query} initialMovies={filterResponse} isDataEnd={dataIsEnd} />
};



