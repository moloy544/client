import Link from "next/link";
import { creatUrlLink } from "@/utils";
import LazyLoadingImage from "./LazyLoadingImage";

const LoaderSkleaton = ({ limit = 15 }) => {
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

        return <LoaderSkleaton limit={limit} />;
    };

    return (
        <>
            {moviesData?.map((data) => (

                <div key={`${data._id}-${data.imdbId}`} className="movie_card border border-yellow-600">

                    <Link className="w-auto h-auto" href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} prefetch={false}>

                        <div className="w-auto object-cover h-[12.50rem] max-h-[220px] mobile:max-h-[170px] bg-white rounded-[3px]">

                                <LazyLoadingImage className="w-full h-full object-fill pointer-events-none select-none rounded-[3px]" actualSrc={data.thambnail} alt={data.title}/>
                        </div>

                        <div className="movie_name_container">
                            <span className="text-white text-[11px] mobile:text-[9px] font-sans line-clamp-3 leading-[14px]">
                                {data.title}
                            </span>
                        </div>

                        <div className="absolute top-0.5 right-0.5 z-10 w-auto h-auto px-1.5 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
                            {data.releaseYear}
                        </div>
                    </Link>
                </div>

            ))}

            {isLoading && moviesData.length > 0 && <LoaderSkleaton limit={limit} />}

        </>
    )
}