import Link from "next/link"
import LazyLoadingImage from "./LazyLoadingImage"

const MoviesCard = ({ moviesData }) => {

    return (
        <>
            {moviesData?.map((data) => (

                <Link key={data._id} href={`/watch/${data._id}`} className="w-auto h-auto max-w-[160px]" prefetch={false}>

                    <div className="movie_card border border-yellow-600">

                        <div className="relative w-32 mobile:w-28 h-[170px] mobile:h-40 bg-white rounded-[3px] object-cover">
                            <LazyLoadingImage className="w-full h-full object-fill pointer-events-none select-none rounded-[3px]"
                                actualSrc={data.thambnail}
                                alt="Movies poster" />
                        </div>

                        <div className="movie_name_container">
                            <span className="w-auto text-white text-[10px] font-sans line-clamp-3 leading-[13px]">
                                {data.title}
                            </span>
                        </div>

                        <div className="absolute top-0.5 right-0.5 z-10 w-auto h-auto px-1 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
                            {data.releaseYear}
                        </div>
                    </div>
                </Link>

            ))}
        </>

    )
}

export default MoviesCard
