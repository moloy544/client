
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import { creatUrlLink, transformToCapitalize } from "@/utils";
import Breadcrumb from "@/app/components/Breadcrumb";

const SomthingWrongError = dynamic(() => import('@/app/components/errors/SomthingWrongError'), { ssr: false })
 
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

    const paramIndustry = params?.industry || ' ';

    const { status, data } = await getData(paramIndustry);

    if (status === 404) {
        notFound();
    }else if (status == 500) {

        return (
            <SomthingWrongError />
        );
    };

    const { actors, industry } = data;

    const title = transformToCapitalize(industry + " Top Actress");

    const breadcrumbData = [
        {
            name: "actress",
        },
        {
            name: industry,
            pathLink: `/browse/category/${industry}`
        }
    ];

    return (
        <>
            <header className="sticky top-0 z-30 px-3 py-2 flex justify-center items-center bg-gray-900 border-b border-b-cyan-700">
                <NavigateBack className="bi bi-arrow-left text-gray-100 text-3xl mobile:text-[25px] cursor-pointer" />
                <div className="w-full h-auto flex justify-center items-center mx-2.5 my-2">
                    <div className="w-fit h-auto px-10 mobile:px-5 pb-0.5">
                        <h1 className="text-xl mobile:text-sm text-rose-500 text-center font-semibold">
                            {title}
                        </h1>
                    </div>
                </div>
                <Link href="/search" className="text-gray-100 mr-10 mobile:mr-2 p-1 text-2xl mobile:text-xl">
                    <i className="bi bi-search"></i>
                </Link>
            </header>

            <Breadcrumb data={breadcrumbData} />

            <div className="w-full overflow-x-hidden h-full pb-2">

                {actors?.length > 0 ? (
                    <main className="w-full h-full pt-2">

                        <div className="w-auto h-fit gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2 py-2">

                            {actors?.map((actor) => (
                                <div key={actor.imdbId} className="w-auto h-auto py-1.5 cursor-pointer bg-pink-100 rounded-sm border border-yellow-500">

                                    <Link href={`/actress/${creatUrlLink(actor.name)}/${actor.imdbId.replace('nm', '')}`}>

                                        <div className="w-auto h-[110px] mobile:h-20 rounded-md border-2 border-cyan-500 mx-4 mobile:mx-2">

                                            <Image
                                                priority
                                                className="w-full h-full object-fill pointer-events-none select-none rounded-sm"
                                                width={150}
                                                height={150}
                                                src={actor.avatar}
                                                alt={actor.name} />

                                        </div>

                                        <div className="w-auto h-auto text-black py-1.5">
                                            <p className="whitespace-normal text-xs font-semibold font-sans text-center leading-[14px]">
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

