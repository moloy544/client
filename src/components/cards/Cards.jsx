import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { creatUrlLink } from "@/utils";

const areEqual = (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    );
};
const MovieCardSkleaton = ({ limit = 20 }) => {
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

const ResponsiveMovieCard = memo(({ data, onClickEvent }) => {

    return (

        <div onClick={onClickEvent} className="movie_card mobile:max-w-[160px] border overflow-hidden">

            <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} title={data.title + ' ' + data.releaseYear + ' ' + data.type} prefetch={false}>
                <div className="relative w-full mobile:max-w-[160px] aspect-[2/3] mobile:min-h-[160px] min-h-[200px] max-h-52">
                    <Image
                        className="w-full h-full select-none rounded-[3px]"
                        fill
                        src={data.thambnail}
                        alt={data.title || 'movie thumbnail'}
                        placeholder="blur"
                        blurDataURL={data.thambnail}
                        priority
                    />
                </div>

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
    )
}, areEqual);
ResponsiveMovieCard.displayName = "ResponsiveMovieCard";

const ResponsiveActorCard = memo(({ data }) => {
    return (
        <div className="w-auto max-w-[150px] h-auto flex justify-center cursor-pointer bg-gray-700 rounded-md px-3 py-3.5">

            <Link href={`/actors/${creatUrlLink(data.name)}/${data.imdbId.replace('nm', '')}`} title={data.name}>

                <div className="w-auto h-auto rounded-full overflow-hidden border-2 border-yellow-600">

                    <Image
                        priority
                        className="w-full object-fill pointer-events-none select-none rounded-full"
                        width={150}
                        height={150}
                        src={data.avatar?.replace('/upload/', '/upload/w_250,h_250,c_scale/')}
                        alt={data.name || 'Movies Bazar Actor avatar'} />

                </div>

                <div className="w-auto h-6 text-gray-300 mt-1.5 px-1.5">
                    <p className="whitespace-normal text-xs font-semibold leading-[14px] line-clamp-2 text-center">
                        {data.name}
                    </p>
                </div>

            </Link>
        </div>
    )
}, areEqual);
ResponsiveActorCard.displayName = "RespsiveActorCard";

export {
    ResponsiveMovieCard,
    ResponsiveActorCard,
    MovieCardSkleaton,
}