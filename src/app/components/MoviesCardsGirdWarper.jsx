'use client'
import { useRouter } from "next/navigation";
import LazyLoadingImage from "./LazyLoadingImage";

export default function MoviesCardsGirdWarper({ isLoading, moviesData }) {

    const router = useRouter();

    const navigatePage = (url) => {

        const encoded = encodeURIComponent(url);

        router.back();
    };

    if (isLoading && moviesData.length < 1) {

        return (
            <>
                {Array.from({ length: 20 }, (_, index) => (
                    <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]">
                    </div>
                ))}
            </>
        )
    };

    if (!isLoading && moviesData.length < 1) {
        return (
            <div className="w-full h-auto bg-white px-3">
                <div className="min-h-[70vh] flex justify-center items-center text-lg text-gray-800 text-center font-bold font-sans">No Movies Found</div>
            </div>
        )
    }

    return (
        
        <div className="w-full h-auto mobile:my-1 px-2 gap-2 md:gap-3 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">

            {moviesData?.map((data) => (
                <div key={data._id} onClick={() => navigatePage(data.watchLink)} className="bg-yellow-800 cursor-pointer relative movies_image_container">
                    <div className="relative w-full object-cover h-52 mobile:h-56 bg-white text-white">
                        <LazyLoadingImage imageStyle="w-full h-full object-fill pointer-events-none select-none rounded-t-[1px]" actualSrc={data.thambnail} alt="Movies poster" />
                    </div>
                    <div className="flex items-center px-2 py-1.5 w-full h-[40px] bg-yellow-900 text-white text-xs font-sans font-semibold">
                        <span className="w-auto truncate-lines-2">{data.title}</span>
                    </div>
                    <div className="absolute top-1 left-1 z-10 w-auto h-auto px-1 py-0.5 bg-purple-700 text-white text-xs text-center font-sans font-semibold rounded-md">{data.releaseYear}</div>
                </div>
            ))}

            {isLoading && moviesData.length > 0 && (
                <>
                    {Array.from({ length: 20 }, (_, index) => (
                        <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]"></div>
                    ))}
                </>
            )}

        </div>

    )
}