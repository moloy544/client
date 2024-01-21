import Link from 'next/link'
import Image from 'next/image'
import { creatUrlLink } from '@/utils'

function SliderMoviesShowcase({ title, moviesData, linkUrl }) {

    return (

        <section className="w-full h-auto pt-2.5 mobile:pt-1">

            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-2">
                <h2 className="text-gray-100 text-[18px] mobile:text-sm font-semibold">{title}</h2>
                <Link href={linkUrl} className="text-base mobile:text-[12px] text-cyan-400">See more</Link>
            </div>

            <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2.5 mobile:gap-2 px-2 scrollbar-hidden">

                {moviesData?.map((data) => (

                    <div key={`${data._id}-${data.imdbId}`} className="movie_card border border-yellow-600">

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

                            <div className="absolute top-0.5 right-0.5 z-10 w-auto h-auto px-1 py-0.5 bg-gray-800 text-yellow-400 text-[10px] text-center font-sans font-semibold rounded-md">
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
