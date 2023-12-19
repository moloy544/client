import Link from "next/link"
import LazyLoadingImage from "./LazyLoadingImage"

const MoviesCard = ({ moviesData }) => {

    return (
        <>
            {moviesData?.map((data) => (

                <Link key={data._id} href={`/watch/${data._id}`} className="w-auto h-auto flex-none">

                    <div className="movies_image_container cursor-pointer relative">

                        <div className="relative w-full object-cover min-w-[120px] max-w-[140px] h-[13rem] max-h-64 mobile:max-h-44 bg-white rounded-[3px]">
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
        </>

    )
}

export default MoviesCard
