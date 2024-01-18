import axios from "axios";
import Link from "next/link";
import LazyLoadingImage from "@/app/components/LazyLoadingImage";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import { transformToCapitalize } from "@/utils";
import { notFound } from "next/navigation";

export default async function Page({ params }) {

    const paramIndustry = params?.industry || ' ';

    const response = await axios.get(`${appConfig.backendUrl}/api/v1/actress/industry/${paramIndustry}`);

    if (response.status !== 200) {
        notFound()
    };

    const { actors, industry } = response.data;

    const title = transformToCapitalize(industry + " Top Actress")

    return (
        <>
            <header className="sticky top-0 z-30 px-3 py-2 flex justify-center items-center bg-gray-900 border-b border-b-cyan-700">
                <NavigateBack className="bi bi-arrow-left text-gray-100 text-3xl mobile:text-[25px] cursor-pointer" />
                <div className="w-full h-auto flex justify-center items-center mx-2.5 my-2">
                    <div className="w-fit h-auto px-10 mobile:px-5 pb-0.5">
                        <h1 className="text-xl mobile:text-sm text-cyan-500 text-center font-semibold">
                            {title}
                        </h1>
                    </div>
                </div>
                <Link href="/search" className="text-gray-100 mr-10 mobile:mr-2 p-1 text-2xl mobile:text-xl">
                    <i className="bi bi-search"></i>
                </Link>
            </header>

            <div aria-label="Breadcrumb" className="bg-gray-800 px-3 pt-2">
                <div className="flex items-center text-base mobile:text-sm text-gray-300">
                    <div>
                        <Link href="/" className="block transition hover:text-cyan-500">
                            <span className="sr-only"> Home </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mobile:h-4 mobile:w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className="rtl:rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <div className="block transition hover:text-cyan-500">
                        actress
                    </div>

                    <div className="rtl:rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <div>
                        <Link href={`/movies/category/${industry}`} className="block transition hover:text-cyan-500">
                            {industry}
                        </Link>
                    </div>

                </div>
            </div>

            <div className="w-full overflow-x-hidden h-full pb-2">

                {actors.length > 0 ? (
                    <main className="w-full min-h-[100vh] pt-2">

                        <div className="w-auto h-fit gap-1.5 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2 py-2">

                            {actors?.map((actor) => (

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

