import Link from "next/link";
import Image from "next/image";
import { creatUrlLink } from "@/utils";

const LoaderSkleaton = ({ limit = 20 }) => {
    return (
        <>
            {Array.from({ length: limit }, (_, index) => (
                <div key={index} className="bg-gray-200 w-auto min-h-[11rem] max-h-64 mobile:max-h-44 rounded-[4px] animate-pulse relative">
                    <div className="w-auto h-auto px-4 py-2 bg-gray-300 absolute right-1 top-1 rounded-md animate-pulse"></div>
                </div>
            ))}
        </>
    )
};

export default function LoadMoreMoviesCard({ isLoading, moviesData, limit }) {

    if (isLoading && moviesData.length < 1) {

        return (<LoaderSkleaton limit={limit} />);
    };

    return (
        <>
            {moviesData?.map((data) => (

                <div key={data.imdbId} className="movie_card border min-h-[160px] max-h-52">

                    <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} title={data.title} prefetch={false}>

                            <Image
                                priority
                                className="w-full h-full object-fill select-none pointer-events-none rounded-[3px]"
                                width={200}
                                height={250}
                                src={data.thambnail}
                                alt={data.title || 'movie thumbnail'}
                                placeholder="blur"
                                blurDataURL={data.thambnail}
                                 />

                        <div className="movie_name_container">
                            <span className="text-white text-xs mobile:text-[10px] font-sans line-clamp-3 leading-[14px] px-2 mobile:py-0.5 py-1">
                                {data.title}
                            </span>
                        </div>

                        <div className="absolute top-0.5 right-0.5 w-auto h-auto px-1.5 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
                            {data.releaseYear}
                        </div>
                    </Link>
                </div>

            ))}

            {isLoading && moviesData.length > 0 && (<LoaderSkleaton limit={limit} />)}

        </>
    )
}