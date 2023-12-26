import LazyLoadingImage from "./LazyLoadingImage";
import Link from "next/link";

const LoaderSkleaton = ({ limit }) => {
    return (
        <>
            {Array.from({ length: limit }, (_, index) => (
                <div key={index} className="bg-gray-200 w-auto min-h-[11rem] max-h-64 mobile:max-h-44 rounded-[4px] animate-pulse relative">
                    <div className="w-auto h-auto px-4 py-2 bg-gray-300 absolute right-1 top-1 rounded-md"></div>
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

                <Link key={data._id} href={`/watch/${data._id}`} className="w-auto h-auto max-w-[160px]">

                    <div className="movie_card border border-yellow-600">

                        <div className="relative w-full object-cover h-[12rem] max-h-56 mobile:max-h-40 bg-white rounded-[3px]">
                            <LazyLoadingImage className="w-full h-full object-fill pointer-events-none select-none rounded-[3px]"
                                actualSrc={data.thambnail}
                                alt="Movies poster" />
                        </div>

                        <div className="movie_name_container">
                            <span className="w-auto text-white text-[11px] mobile:text-[9px] font-sans truncate-lines-2">
                                {data.title}
                            </span>
                        </div>

                        <div className="absolute top-1 right-1 z-10 w-auto h-auto px-1 py-0.5 bg-gray-900 text-yellow-500 text-xs mobile:text-[10px] text-center font-sans font-semibold rounded-md">
                            {data.releaseYear}
                        </div>
                    </div>
                </Link>
            ))}

            {isLoading && moviesData.length > 0 && <LoaderSkleaton limit={limit} />}

        </>
    )
}