import { fetchLoadMoreMovies, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import { categoryArray } from "@/constant/constsnt";
import MoviesFilterDropDown from "../../MoviesFilterDropDown";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

export async function generateMetadata({ params }) {

    const editParamsQuery = transformToCapitalize(params.genre);

    const metaData = {
        title: `${editParamsQuery} movies`,
        description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
        keywords: `${editParamsQuery} movie, Watch ${editParamsQuery} movie online, ${editParamsQuery} movie watch free online, Where to watch ${editParamsQuery} movies online`,

        openGraph: {
            title: `${editParamsQuery} movies`,
            description: `Watch ${editParamsQuery} movies online Movies Bazaar`,
            url: `https://moviesbazaar.vercel.app/listing/genre/${params.genre}`
        },
    };

    return metaData;
};

//Revalidate page every 30 minutes
export const revalidate = 1800;

export default async function Page({ params }) {

    const genre = params?.genre;

    const apiUrl = `${appConfig.backendUrl}/api/v1/movies/genre/${genre}`;

    const { filterResponse, dataIsEnd } = await fetchLoadMoreMovies({
        
        apiPath: apiUrl,
        limitPerPage: 30,
        page: 1
    });;

    const capitalizeGenre = transformToCapitalize(genre);

    return (
        <>
            <NavigateBackTopNav title={capitalizeGenre} />

            <MoviesFilterDropDown filterData={categoryArray.category} />

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

