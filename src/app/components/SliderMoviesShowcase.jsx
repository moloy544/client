import Link from 'next/link'
import Image from 'next/image'
import { creatUrlLink } from '@/utils'

function SliderMoviesShowcase({ title, moviesData, linkUrl }) {

    if (!moviesData || moviesData.length === 0) {
       return null; 
    }

    return (

        <section className="w-full h-auto py-2 mobile:py-1.5">

            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-3 mobile:pb-2">

                <div className="text-gray-200 text-[18px] mobile:text-sm font-medium line-clamp-1">{title}</div>

                {linkUrl && (
                    <Link href={linkUrl} className="text-[14px] mobile:text-[12px] text-cyan-500 hover:text-cyan-400 font-medium">
                        View All
                        <i className="bi bi-chevron-right"></i>
                    </Link>
                )}
            </div>

            <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2.5 mobile:gap-2 px-2 scrollbar-hidden">

                {moviesData?.map((data) => (

                    <div key={data.imdbId} className="movie_card border border-yellow-700">

                        <Link href={`/watch/${data.type}/${creatUrlLink(data.title)}/${data.imdbId?.replace('tt', '')}`}>

                            <div className="relative w-[140px] h-[180px] mobile:w-28 mobile:h-40 bg-white rounded-[3px] object-cover">

                                <Image
                                    priority
                                    className="pointer-events-none select-none rounded-[3px]"
                                    src={data.thambnail}
                                    fill
                                    alt={data.title} />
                            </div>

                            <div className="movie_name_container">
                                <span className="w-auto text-white text-[10px] font-sans line-clamp-3 leading-[13px]">
                                    {data.title}
                                </span>
                            </div>

                            <div className="absolute top-0.5 right-0.5 w-auto h-auto px-1 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
                                {data.releaseYear}
                            </div>
                        </Link>

                    </div>

                ))}

            </div>

        </section>

    )
}

export default SliderMoviesShowcase
