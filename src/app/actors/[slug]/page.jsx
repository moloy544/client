
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatUrlLink, transformToCapitalize } from "@/utils";
import Breadcrumb from "@/components/Breadcrumb";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })
 
const getData = async (industry) => {
    let status = 500;
    let data = {};
  
    try {
      const response = await axios.post(`${appConfig.backendUrl}/api/v1/actress/industry`, { industry });
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
    }else if (status == 500) {

        return (
            <SomthingWrongError />
        );
    };

    const { actors, industry } = data;

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
        <>
            <NavigateBackTopNav title={title} />

            <Breadcrumb data={breadcrumbData} />

            <div className="w-full overflow-x-hidden h-full pb-2">

                {actors?.length > 0 ? (
                    <main className="w-full h-full pt-2">

                        <div className="w-auto h-fit gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2 py-2">

                            {actors?.map((actor) => (
                                <div key={actor.imdbId} className="w-auto max-w-[150px] h-auto flex justify-center cursor-pointer bg-gray-700 rounded-md px-3 py-3.5">

                                    <Link href={`/actors/${creatUrlLink(actor.name)}/${actor.imdbId.replace('nm', '')}`} title={actor.name}>

                                        <div className="w-auto h-auto rounded-full overflow-hidden border-2 border-yellow-600">

                                            <Image
                                                priority
                                                className="w-full object-fill pointer-events-none select-none rounded-full"
                                                width={150}
                                                height={150}
                                                src={actor.avatar?.replace('/upload/', '/upload/w_250,h_250,c_scale/')}
                                                alt={actor.name || 'Actor avatar'} />

                                        </div>

                                        <div className="w-auto h-6 text-gray-300 mt-1.5 px-1.5">
                                            <p className="whitespace-normal text-xs font-semibold leading-[14px] line-clamp-2 text-center">
                                                {actor.name}
                                            </p>
                                        </div>

                                    </Link>
                                </div>
                            ))}

                        </div>
                    </main>
                ) : (
                    <div className=" w-full h-auto min-h-[100vh] flex justify-center items-center">
                        <div className="w-fit h-auto px-4 py-1.5 text-white bg-yellow-500 text-base mobile:text-sm text-center font-semibold">
                            No Actress Found
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

