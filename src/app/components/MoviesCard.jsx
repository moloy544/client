'use client'
import { useRouter } from "next/navigation";
import LazyLoadingImage from "./LazyLoadingImage";

export default function MoviesCard({ isLoading, moviesData }) {

    const router = useRouter();

    const navigatePage = (url) => {

        const encodedUrl = encodeURIComponent(url);

        router.push(`/watch?movie=${encodedUrl}`);
    };

    if (isLoading && moviesData.length < 1) {

        return (
            <>
                {Array.from({ length: 20 }, (_, index) => (
                    <div key={index} className="bg-gray-300 w-auto h-56 mobile:h-52 rounded-[4px] movies_card_pre-loader">
                    </div>
                ))}
            </>
        )
    };

    if (!isLoading && moviesData.length < 1) {
        return <div className="w-full h-auto bg-white px-3">
                <div className="min-h-[70vh] flex justify-center items-center text-lg text-gray-800 text-center font-bold font-sans">No Movies Found</div>
            </div>
    };

    return (
        <>
            {moviesData?.map((data) => (
                <div key={data._id} onClick={() => navigatePage(data.watchLink)} className="bg-yellow-800 cursor-pointer relative movies_image_container max-w-[140px]">
                    <div className="relative w-full object-cover h-52 max-h-44 mobile:max-h-36 bg-white text-white">
                        <LazyLoadingImage imageStyle="w-full h-full object-fill pointer-events-none select-none rounded-t-[1px]" actualSrc={data.thambnail} alt="Movies poster" />
                    </div>
                    <div className="flex items-center px-2 py-1.5 w-full h-[40px] bg-yellow-900">
                        <span className="w-auto text-white text-[10px] font-sans font-semibold truncate-lines-2">{data.title}</span>
                    </div>
                    <div className="absolute top-1 right-1 z-10 w-auto h-auto px-1 py-0.5 bg-purple-700 text-white text-xs mobile:text-[10px] text-center font-sans font-semibold rounded-md">{data.releaseYear}</div>
                </div>
            ))}

            {isLoading && moviesData.length > 0 && (
                <>
                    {Array.from({ length: 20 }, (_, index) => (
            
                        <div key={index} className="bg-gray-300 w-auto h-56 mobile:h-[185px] rounded-[4px] movies_card_pre-loader">
                        </div>
                    ))}
                </>
            )}

        </>
    )
}