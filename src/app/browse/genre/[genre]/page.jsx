import dynamic from "next/dynamic";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

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
            url: `${appConfig.appDomain}/browse/genre/${params.genre}`
        },
    };

    return metaData;
};

export default async function Page({ params }) {

    const genre = params?.genre;

    const apiUrl = `${appConfig.backendUrl}/api/v1/movies/genre/${genre}`;

    const filterData = {
        dateSort: -1,
    };

    const { status, data, dataIsEnd } = await loadMoreFetch({

        apiPath: apiUrl,
        bodyData: { filterData },
        limitPerPage: 40
    });

    if (status === 500) {
        return (
            <SomthingWrongError />
        )
    };

    const capitalizeGenre = transformToCapitalize(genre);

    const { filterOptions, moviesData } = data;

    return (
        <>
            <NavigateBackTopNav title={capitalizeGenre + " collection"} />

            <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">

                <LoadMoreMoviesGirdWarper
                    apiUrl={apiUrl}
                    limitPerPage={40}
                    initialFilter={filterData}
                    serverResponseExtraFilter={filterOptions || []}
                    initialMovies={moviesData || []}
                    isDataEnd={dataIsEnd}
                />

            </div>
        </>
    )
};

