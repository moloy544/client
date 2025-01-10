import Link from "next/link";
import Image from "next/image";
import { creatUrlLink, editActorsImageUrl, resizeImage } from "@/utils";

const MovieCardSkleaton = ({ limit = 20 }) => {
    return (
        <>
            {Array.from({ length: limit }, (_, index) => (
                <div key={index} className="bg-gray-200 w-autio aspect-[4/5.8] rounded-[4px] animate-pulse relative overflow-hidden px-2">
                    <div className="w-auto h-auto px-4 py-2 bg-gray-300 absolute left-1 top-1 rounded-md animate-pulse"></div>
                    <div className="w-auto h-auto px-4 py-2 bg-gray-300 absolute right-1 top-1 rounded-md animate-pulse"></div>
                    <div className="w-full h-2 bg-gray-300 absolute bottom-5 left-0 rounded-sm mx-1 animate-pulse"></div>
                    <div className="w-[60%] h-2 bg-gray-300 absolute bottom-2 left-0 rounded-sm mx-1 animate-pulse"></div>
                </div>
            ))}
        </>
    )
};

const ResponsiveMovieCard = ({ data, onClickEvent }) => {

    const { imdbId, title, displayTitle, thumbnail, type, releaseYear, language, category, videoType } = data;

    return (

        <div onClick={onClickEvent} className="responsive_movie_card mobile:max-w-[160px] max-w-[180px] border overflow-hidden">

            <Link href={`/watch/${type}/${creatUrlLink(title)}/${imdbId?.replace('tt', '')}`} title={title + ' ' + releaseYear + ' ' + type} prefetch={false}>

                <div className="relative w-full mobile:max-w-[160px] aspect-[4/5.7] mobile:min-h-[160px] min-h-[200px]">
                    <Image
                        className="w-full h-full select-none rounded-[3px]"
                        fill
                        src={resizeImage(thumbnail)}
                        alt={title || 'movie thumbnail'}
                        placeholder="blur"
                        blurDataURL={resizeImage(thumbnail)}
                    />
                </div>

                <div className="movie_name_container px-2 py-1.5">
                    <span
                        className="w-auto text-white font-semibold line-clamp-3 mobile:text-[10px] text-xs leading-[14px] mobile:leading-3 capitalize break-words"
                        aria-label={title} // For SEO and accessibility
                        title={title} // Optional tooltip for user
                    >
                        {displayTitle
                            ? displayTitle
                            : category !== "bollywood" && language !== "hindi dubbed"
                                ? title.concat(' (' + language + ')')
                                : title
                        }
                    </span>
                </div>

                <div className="absolute mobile:text-[9px] text-xs top-0.5 left-0.5 w-auto h-auto px-[3px] py-[1px] bg-gray-950 bg-opacity-70 text-yellow-400 text-center font-semibold rounded-sm">
                    {releaseYear}
                </div>
                {videoType && (
                    <div className={`absolute mobile:text-[9px] text-xs top-0.5 right-0.5 w-auto h-auto px-[3px] ${videoType === 'hd' ? "bg-rose-600" : "bg-gray-900"} bg-opacity-70 text-gray-100 text-cente font-semibold rounded-sm uppercase`}>
                        {videoType}
                    </div>
                )}
            </Link>
        </div>
    )
}

const ResponsiveActorCard = ({ data }) => {
    return (
        <div className="w-auto max-w-[160px] h-auto flex justify-center bg-[#293445] rounded-md px-3 py-3.5">

            <Link href={`/actors/${creatUrlLink(data.name)}/${data.imdbId.replace('nm', '')}`} title={data.name} prefetch={false}>

                <div className="w-auto h-auto aspect-[4/4] rounded-full overflow-hidden border-2 border-gray-600">

                    <Image
                        className="w-full h-full object-fill pointer-events-none select-none rounded-full"
                        width={150}
                        height={150}
                        src={editActorsImageUrl(data.avatar, "w300_and_h300_face")}
                        placeholder="blur"
                        blurDataURL={editActorsImageUrl(data.avatar, "w300_and_h300_face")}
                        alt={data.name || 'Actor avatar'}
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
