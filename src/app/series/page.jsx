import dynamic from "next/dynamic";
import axios from "axios";
import { appConfig } from "@/config/config";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import SliderShowcase from "@/components/SliderShowcase";
import Footer from "@/components/Footer";
import { BASE_OG_IMAGE_URL } from "@/constant/assets_links";
const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

export const metadata = {
    title: 'Top Web Series Collection',
    description: 'Explore an extensive collection of top web series from Hollywood, Bollywood, South Indian cinema, and popular platforms like Netflix, Hotstar, and Amazon Prime at Movies Bazar.',
    keywords: 'web series collection, Hollywood series, Bollywood series, South Indian series, watch Netflix series free, latest Hindi series, top-rated web series',

    openGraph: {
        images: BASE_OG_IMAGE_URL,
        title: 'Top Web Series Collection',
        description: 'Explore an extensive collection of top web series from Hollywood, Bollywood, South Indian cinema, and popular platforms like Netflix, Hotstar, and Amazon Prime at Movies Bazar.',
        url: `${appConfig.appDomain}/series`,
    },
};


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

export const revalidate = 14400 * 3 // revalidate at most every 12 hours

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

            <main className="w-full h-full overflow-x-hidden py-2 bg-custom-dark-bg">

                {sliderSeries?.map((data) => (

                    <SliderShowcase key={data.title} title={data.title} moviesData={data.seriesData} linkUrl={data.linkUrl} />
                ))}

            </main>
            <Footer />
        </>
    )
};
