import LazyLoadingImage from "./LazyLoadingImage";
import Link from "next/link";

const loaderSkleatons = () => {
    return (
        <>
            {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className="bg-gray-300 w-auto min-h-[11rem] max-h-64 mobile:max-h-44 rounded-[4px] movies_card_pre-loader">
                </div>
            ))}
        </>
    )
};

export default function LoadMoreMoviesCard({ isLoading, moviesData }) {

    if (isLoading && moviesData.length < 1) {

        return loaderSkleatons();
    };

    if (!isLoading && moviesData.length < 1) {
        return <div className="w-full h-auto bg-white px-3">
            <div className="min-h-[70vh] flex justify-center items-center text-lg text-gray-800 text-center font-bold font-sans">
                No Movies Found
            </div>
        </div>
    };

    return (
        <>
            {moviesData?.map((data) => (

                <Link key={data._id} href={`/watch/${data._id}`}>

                    <div className="movies_image_container cursor-pointer relative">

                        <div className="relative w-full object-cover h-[13rem] max-h-64 mobile:max-h-44 bg-white rounded-[3px]">
                            <LazyLoadingImage className="w-full h-full object-fill pointer-events-none select-none rounded-[3px]"
                                actualSrc={data.thambnail}
                                alt="Movies poster" />
                        </div>

                        <div className="movie_name_container">
                            <span className="w-auto text-white text-[11px] mobile:text-[9px] font-sans truncate-lines truncate-lines-3">
                                {data.title}
                            </span>
                        </div>

                        <div className="absolute top-1 right-1 z-10 w-auto h-auto px-1 py-0.5 bg-gray-900 text-yellow-500 text-xs mobile:text-[10px] text-center font-sans font-semibold rounded-md">
                            {data.releaseYear}
                        </div>
                    </div>
                </Link>
            ))}

            {isLoading && moviesData.length > 0 && loaderSkleatons()}

        </>
    )
}