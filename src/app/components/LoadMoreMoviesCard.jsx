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

                <div key={`${data._id}-${data.imdbId}`} className="movie_card border border-yellow-700">

                    <Link className="w-auto h-auto" href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} prefetch={false}>

                        <div className="w-auto object-cover h-[12.50rem] max-h-[220px] mobile:max-h-[160px] bg-white rounded-[3px]">

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

                        </div>

                        <div className="movie_name_container">
                            <span className="text-white text-[11px] mobile:text-[9px] font-sans line-clamp-3 leading-[14px]">
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