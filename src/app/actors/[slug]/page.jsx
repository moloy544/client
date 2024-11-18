import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { appConfig } from "@/config/config";
import { transformToCapitalize } from "@/utils";
import Breadcrumb from "@/components/Breadcrumb";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";
import LoadMoreActorsGirdWarper from "@/components/LoadMoreActors";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false });
const apiUrl = `${appConfig.backendUrl}/api/v1/actress/industry`;

const getData = async (industry) => {
    let status = 500;
    let data = {};

    try {
        const response = await axios.post(apiUrl, { industry, skip: 0, limit: 30 });
        status = response.status;
        data = response.data;
    } catch (error) {
        if (error.response) {
            status = error.response.status;
        }
    }

    return { status, data };
};


export default async function Page({ params }) {

    const paramIndustry = params?.slug || ' ';

    const { status, data } = await getData(paramIndustry);

    if (status === 404) {
        notFound();
    } else if (status == 500) {

        return (
            <SomthingWrongError />
        );
    };

    const { actors, industry, dataIsEnd } = data;

    const title = transformToCapitalize(industry + " actors");

    const breadcrumbData = [
        {
            name: "actors",
        },
        {
            name: industry,
            pathLink: `/browse/category/${industry}`
        }
    ];

    return (
        <div className="w-full h-full min-h-screen bg-custom-dark-bg">
            <NavigateBackTopNav title={title} />

            <Breadcrumb data={breadcrumbData} />

            <LoadMoreActorsGirdWarper
                apiUrl={apiUrl}
                industry={industry}
                initialActors={actors}
                isDataEnd={dataIsEnd}
            />
            <Footer />
        </div>
    )
}

