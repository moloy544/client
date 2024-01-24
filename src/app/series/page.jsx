import axios from "axios";
import { appConfig } from "@/config/config";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SliderMoviesShowcase from "../components/SliderMoviesShowcase";

export const metadata = {

    title: 'Series',
    description: 'Explore a diverse collection of web series from Hollywood, Bollywood, and South Indian cinema. Enjoy top-rated series in each category with compelling stories and brilliant performances.',
    keywords: 'web series, hollywood series, bollywood series, south indian series, south series, netflix series free, watch netflix series free, latest hindi series',

    openGraph: {
        images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
        title: `Series`,
        description: `Watch bollywood hollywood south netflix series online Movies Bazaar`,
        url: `https://moviesbazaar.vercel.app/series`
    },
}

export default async function Page() {

    const response = await axios.post(`${appConfig.backendUrl}/api/v1/series`);

    const { sliderSeries } = response.data.series || {};

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
