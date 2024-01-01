import Link from 'next/link'
import React from 'react'
import MoviesCard from './MoviesCard'

function SliderMoviesShowcase({ title, moviesData, linkUrl }) {

    return (

        <section className="w-full h-auto pt-2.5 mobile:pt-1">

            <div className="w-full h-auto flex justify-between items-center px-2.5 pb-2">
                <h2 className="text-gray-200 text-xl mobile:text-sm font-semibold">{title}</h2>
                <Link href={linkUrl} className="text-base mobile:text-[12px] text-cyan-400 font-semibold">See more</Link>
            </div>

            <div className="w-full h-auto flex flex-row overflow-x-scroll gap-2 px-2 scrollbar-hidden">

                <MoviesCard moviesData={moviesData} />

            </div>

        </section>

    )
}

export default SliderMoviesShowcase
