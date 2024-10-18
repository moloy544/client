import Link from "next/link";
import Image from "next/image";
import { creatUrlLink, resizeImage } from "@/utils";

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

const ResponsiveMovieCard = ({ data, onClickEvent }) => {

    return (

        <div onClick={onClickEvent} className="responsive_movie_card mobile:max-w-[160px] border overflow-hidden">

            <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`} title={data.title + ' ' + data.releaseYear + ' ' + data.type} prefetch={false}>
                <div className="relative w-full mobile:max-w-[160px] aspect-[4/5.6] mobile:min-h-[160px] min-h-[200px]">
                    <Image
                        className="w-full h-full select-none rounded-[3px]"
                        fill
                        src={resizeImage(data.thambnail)}
                        alt={data.title || 'movie thumbnail'}
                        placeholder="blur"
                        blurDataURL={resizeImage(data.thambnail)}
                    />
                </div>

                <div className="movie_name_container px-1.5 mobile:py-0.5 py-1">
                    <span className="text-white text-xs mobile:text-[10px] font-sans line-clamp-3 leading-[14px]">
                        {data.title}
                    </span>
                </div>

                <div className="absolute top-0.5 right-0.5 w-auto h-auto px-1.5 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
                    {data.releaseYear}
                </div>
            </Link>
        </div>
    )
}

const ResponsiveActorCard = ({ data }) => {
    return (
        <div className="w-auto max-w-[150px] h-auto flex justify-center cursor-pointer bg-gray-700 rounded-md px-3 py-3.5">

            <Link href={`/actors/${creatUrlLink(data.name)}/${data.imdbId.replace('nm', '')}`} title={data.name} prefetch={false}>

                <div className="w-auto h-auto rounded-full overflow-hidden border-2 border-yellow-600">

                    <Image
                        className="w-full object-fill pointer-events-none select-none rounded-full"
                        width={150}
                        height={150}
                        src={data.avatar}
                        placeholder="blur"
                        blurDataURL={data.thambnail}
                        alt={data.name || 'Movies Bazar Actor avatar'}
                    />

                </div>

                <div className="w-auto h-6 text-gray-300 mt-1.5 px-1.5">
                    <p className="whitespace-normal text-xs font-semibold leading-[14px] line-clamp-2 text-center capitalize">
                        {data.name}
                    </p>
                </div>

            </Link>
        </div>
    )
};

export {
    ResponsiveMovieCard,
    ResponsiveActorCard,
    MovieCardSkleaton,
}
