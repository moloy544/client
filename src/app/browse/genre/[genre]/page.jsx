import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

export async function generateMetadata({ params }) {

    const editParamsQuery = transformToCapitalize(params.genre);

    const metaData = {
        title: `${editParamsQuery} movies collaction`,
        description: `Watch ${editParamsQuery} movies, series free of cost online Movies Bazaar have lot of ${editParamsQuery} movies and series collaction`,
        keywords: `${editParamsQuery} movie, Watch ${editParamsQuery} movie online, ${editParamsQuery} movie watch free online, Where to watch ${editParamsQuery} movies online`,

        openGraph: {
            images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
            title: `${editParamsQuery} movies collaction`,
            description: `Watch ${editParamsQuery} movies, series online free of cost Movies Bazaar have lot of ${editParamsQuery} movies and series collaction`,
            url: `https://moviesbazar.online/listing/genre/${params.genre}`
        },
    };

    return metaData;
};

export default async function Page({ params }) {

    const genre = params?.genre;

    const apiUrl = `${appConfig.backendUrl}/api/v1/movies/genre/${genre}`;

    const filterData = {
        dateSort: -1,
        categoryFilter: "all",
    };

    const { data, dataIsEnd } = await loadMoreFetch({

        apiPath: apiUrl,
        bodyData: { filterData },
        limitPerPage: 30
    });

    const capitalizeGenre = transformToCapitalize(genre);


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
    }, {

        title: "Filter by type",
        data: [
            {
                id: 1,
                filter: 'type',
                name: "movie"
            },

            {
                id: 2,
                filter: 'type',
                name: "series"
            }]
    }];

    return (
        <>
            <NavigateBackTopNav title={capitalizeGenre + " movies"} />

            <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

                <LoadMoreMoviesGirdWarper
                    apiUrl={apiUrl}
                    limitPerPage={30}
                    initialFilter={filterData}
                    serverResponseExtraFilter={extraFilter}
                    initialMovies={data.moviesData || []}
                    isDataEnd={dataIsEnd}
                />

            </div>
        </>
    )
};

