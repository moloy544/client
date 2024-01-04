import axios from "axios";
import Link from "next/link";
import LazyLoadingImage from "@/app/components/LazyLoadingImage";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import { transformToCapitalize } from "@/utils";

//Revalidate page every 30 minutes
export const revalidate = 1800;

export default async function Page({ params }) {

    const industry = params?.industry || ' ';

    const response = await axios.get(`${appConfig.backendUrl}/api/v1/actress/industry/${industry}`)

    const actorsdata = response.data?.actors;

    const title = transformToCapitalize(industry + " Top Actress")

    return (
        <>
            <header className="sticky top-0 z-30 px-3 py-2 flex justify-center items-center bg-gray-900 border-b border-b-cyan-700">
                <NavigateBack className="bi bi-arrow-left text-yellow-500 text-3xl mobile:text-[25px] cursor-pointer" />
                <div className="w-full h-auto flex justify-center items-center mx-2.5 my-2">
                    <div className="w-fit h-auto px-10 mobile:px-5 pb-0.5">
                        <h1 className="text-xl mobile:text-sm text-cyan-500 text-center font-semibold">
                            {title}
                        </h1>
                    </div>
                </div>
            </header>
            
            <div className="w-full overflow-x-hidden h-full bg-gray-800 py-2">

                {actorsdata.length > 0 ? (
                    <main className="w-full h-fit min-h-[100vh] pt-2">

                        <div className="w-auto h-fit gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2 py-2">

                            {actorsdata?.map((actor) => (

                                <Link
                                    href={`/actress/${actor.industry?.toLowerCase()}/${actor.name.toLowerCase().replace(/[' ']/g, '-')}`}
                                    key={actor._id}
                                    className="w-auto h-auto py-1.5 cursor-pointer bg-pink-100 rounded-sm border border-yellow-500">

                                    <div className="w-auto h-[110px] mobile:h-20 rounded-md border-2 border-cyan-500 mx-4 mobile:mx-2">
                                        <LazyLoadingImage
                                            className="w-full h-full object-fill pointer-events-none select-none rounded-sm"
                                            actualSrc={actor.avatar}
                                            alt={actor.name}
                                        />
                                    </div>

                                    <div className="w-auto h-auto text-black py-1.5">
                                        <p className="whitespace-normal text-xs font-semibold font-sans text-center leading-[14px]">
                                            {actor.name}
                                        </p>
                                    </div>

                                </Link>
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

