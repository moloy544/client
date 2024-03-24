import axios from "axios";
import { appConfig } from "@/config/config";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SliderMoviesShowcase from "../components/SliderMoviesShowcase";
import SomthingWrongError from "../components/errors/SomthingWrongError";

export const metadata = {

    title: 'Series',
    description: 'Explore a diverse collection of web series from Hollywood, Bollywood, and South Indian cinema. Enjoy top-rated series in each category with compelling stories and brilliant performances.',
    keywords: 'web series, hollywood series, bollywood series, south indian series, south series, netflix series free, watch netflix series free, latest hindi series',

    openGraph: {
        images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
        title: `Series`,
        description: `Watch bollywood hollywood south netflix series online Movies Bazaar`,
        url: `https://moviesbazar.online/series`
    },
}

const getSeriesLayoutData = async () => {

    let status = 500;

    let pageData = {};

    try {

        const response = await axios.post(`${appConfig.backendUrl}/api/v1/series`);

        status = response.status;
        pageData = response.data;

    } catch (error) {
        if (error.response) {
            status = error.response.status;
        }
    }
    return { pageData, status }
}

export default async function Page() {

    const { pageData, status } = await getSeriesLayoutData();

    if (status === 500) {
        return (
            <SomthingWrongError />
        )
    };

    const { sliderSeries } = pageData.seriesPageLayout;

    return (
        <>
            <NavigateBackTopNav title="Series" />

            <main className="w-full overflow-x-hidden h-full py-2">

                {sliderSeries?.map((data) => (

                    <SliderMoviesShowcase key={data.title} title={data.title} moviesData={data.seriesData} linkUrl={data.linkUrl} />
                ))}

            </main>

        </>
    )
};
